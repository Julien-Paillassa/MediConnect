import { diffArrays } from 'diff'
import * as fs from 'fs'
import https from 'https'
import moment from 'moment'
import path from 'path'
import AppDataSource from '../data-source'
import { MarketingAuthorizationDeclarationStatus } from '../entity/DrugPackage'
import { DrugSpecification } from '../entity/DrugSpecification'
import * as DrugCompositionService from '../services/drug-composition.service'
import * as DrugGenericService from '../services/drug-generic.service'
import * as DrugPackageService from '../services/drug-package.service'
import * as DrugSpecificationService from '../services/drug-specification.service'
import * as GenericService from '../services/generic.service'
import { messageWithDots, replaceLastOccurrence } from './string.helper'
import { type Changes } from '../../@types/mediconnect'
import { type ObjectLiteral } from 'typeorm'

const CHUNK_SIZE: number = 2500

// =====================================================================================================================
// ================================================== PARSE FUNCTIONS ==================================================
// =====================================================================================================================

const parseCsvLineIntoJSON = (line: string, fields: string[] = [], separator: string = ','): ObjectLiteral => {
  const TRUES = ['true', 'oui']
  const FALSES = ['false', 'non']

  const values = line.split(separator)
  if (values.length < fields.length) {
    throw new Error('Number of fields and values do not match, expected ' + fields.length + ' values, got ' + values.length)
  }

  const object: ObjectLiteral = {}
  fields.forEach((field, index) => {
    if (field === '') return
    const value = values[index].trim()

    let formattedValue
    if (value === '') {
      formattedValue = null
    } else if ([...TRUES, ...FALSES].includes(value.toLowerCase())) {
      formattedValue = value in TRUES
    } else if (!isNaN(Number(replaceLastOccurrence(value, ',', '.').replace(',', '')))) {
      formattedValue = Number(replaceLastOccurrence(value, ',', '.').replace(',', ''))
    } else {
      formattedValue = value
    }

    object[field] = formattedValue
  })

  return object
}

const parseDrugSpecificationData = (line: string): ObjectLiteral => {
  const fields = ['id', 'name', 'form', 'administrations', 'marketingAuthorizationStatus', 'marketingAuthorizationProcedure', 'isBeingMarketed', 'marketingAuthorizationDate', 'ogDbStatus', 'europeanAuthorizationNumber', 'holders', 'reinforcedMonitoring']
  const data = parseCsvLineIntoJSON(line, fields, '\t')
  data.administrations = data.administrations.split(';')
  data.holders = data.holders.split(';')
  return data
}

const parseDrugPackageData = (line: string): ObjectLiteral => {
  const fields = ['drugId', 'id', 'name', 'status', 'marketingAuthorizationStatus', 'marketingAuthorizationDeclarationDate', 'longId', 'isAgreedToCommunities', 'refundRate', '', 'price', '', 'refundingInformation']
  const data = parseCsvLineIntoJSON(line, fields, '\t')
  data.marketingAuthorizationStatus = data.marketingAuthorizationStatus
    .replace("Déclaration d'arrêt de commercialisation", MarketingAuthorizationDeclarationStatus.STOPPED)
    .replace('(le médicament n\'a plus d\'autorisation)', 'pour autorisation retirée')
  return data
}

const parseDrugCompositionData = (line: string): ObjectLiteral => {
  const fields = ['drugId', 'name', 'substanceCode', 'substanceName', 'substanceDosage', 'substanceDosageReference', 'substanceNature', 'substancesLinkNumber']
  const data = parseCsvLineIntoJSON(line, fields, '\t')
  return data
}

const parseDrugPrescriptionRestrictionData = (line: string): ObjectLiteral => {
  const fields = ['drugId', 'prescriptionRestriction']
  const data = parseCsvLineIntoJSON(line, fields, '\t')
  return data
}

const parseGenericData = (line: string): ObjectLiteral => {
  const fields = ['id', 'name', 'drugId', 'type', 'rank']
  const data = parseCsvLineIntoJSON(line, fields, '\t')
  const generic = { id: data.id, name: data.name }
  const drugGeneric = { id: data.drugId, type: data.type, rank: data.rank }

  return { generic, drugGeneric }
}

// =====================================================================================================================
// ================================================= IMPORT FUNCTIONS ==================================================
// =====================================================================================================================

const importDrugSpecificationData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Importing drug specification data...`)
  const filePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_bdpm.txt`)
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const data = parseDrugSpecificationData(line)
        await DrugSpecificationService.save(data)
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Specification (CIS_bdpm.txt, l.${i + index + 1}) - `, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().toISOString()}] Finished importing ${chunkData.length} drug specifications data. Ignored lines: ${ignoredLines}`)
  }
}

const importDrugPackageData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Importing drug package data...`)
  const filePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_CIP_bdpm.txt`)
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const data = parseDrugPackageData(line)
        data.drug = await AppDataSource.manager.findOneBy(DrugSpecification, { id: data.drugId })
        if (data.drug === null) {
          console.log(`[${moment.utc().toISOString()}] Package (CIS_CIP_bdpm.txt, l.${i + index + 1}) - Drug specification with id ${data.drugId} not found`)
          ignoredLines++
          continue
        }

        await DrugPackageService.save(data)
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Package (CIS_CIP_bdpm.txt, l.${i + index + 1}) - `, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().toISOString()}] Finished importing ${chunkData.length} drug packages data. Ignored lines: ${ignoredLines}`)
  }
}

const importDrugCompositionData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Importing drug composition data...`)
  const filePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_COMPO_bdpm.txt`)
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const data = parseDrugCompositionData(line)
        data.drug = await AppDataSource.manager.findOneBy(DrugSpecification, { id: data.drugId })
        if (data.drug === null) {
          console.log(`[${moment.utc().toISOString()}] Composition (CIS_COMPO_bdpm.txt, l.${i + index + 1}) - Drug specification with id ${data.drugId} not found`)
          ignoredLines++
          continue
        }

        await DrugCompositionService.create(data)
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Composition (CIS_COMPO_bdpm.txt, l.${i + index + 1}) - `, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().toISOString()}] Finished importing ${chunkData.length} drug compositions data. Ignored lines: ${ignoredLines}`)
  }
}

const importDrugPrescriptionRestrictionData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Importing drug prescription restriction data...`)
  const filePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_CPD_bdpm.txt`)
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const data = parseDrugPrescriptionRestrictionData(line)
        const drugSpecification = await AppDataSource.manager.findOneBy(DrugSpecification, { id: data.drugId })
        if (drugSpecification === null) {
          console.log(`[${moment.utc().toISOString()}] Prescription restriction (CIS_CPD_bdpm.txt, l.${i + index + 1}) - Drug specification with id ${data.drugId} not found`)
          ignoredLines++
          continue
        }
        await DrugSpecificationService.update(drugSpecification.id, { prescriptionRestriction: data.prescriptionRestriction })
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Prescription restriction (CIS_CPD_bdpm.txt, l.${i + index + 1}) - `, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().toISOString()}] Finished importing ${chunkData.length} drug prescription restrictions data. Ignored lines: ${ignoredLines}`)
  }
}

const importGenericData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Importing generic data...`)
  const filePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_GENER_bdpm.txt`)
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const { generic, drugGeneric } = parseGenericData(line)
        drugGeneric.drug = await AppDataSource.manager.findOneBy(DrugSpecification, { id: drugGeneric.drugId })
        if (drugGeneric.drug === null) {
          console.log(`[${moment.utc().toISOString()}] Generics (CIS_GENER_bdpm.txt, l.${i + index + 1}) - Drug specification with id ${drugGeneric.drugId} not found`)
          ignoredLines++
          continue
        }
        drugGeneric.generic = await GenericService.save({ id: generic.id, name: generic.name })

        await DrugGenericService.save({ drug: drugGeneric.drug, generic: drugGeneric.generic, type: drugGeneric.type, rank: drugGeneric.rank })
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Generics (CIS_GENER_bdpm.txt, l.${i + index + 1}) - `, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().toISOString()}] Finished importing ${chunkData.length} drug generics data. Ignored lines: ${ignoredLines}`)
  }
}

// =====================================================================================================================
// ================================================= UPDATE FUNCTIONS ==================================================
// =====================================================================================================================

const updateDrugSpecificationData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Updating drug specification data...`)
  const oldFilePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_bdpm.txt`)
  const oldData = fs.readFileSync(oldFilePath, 'latin1').split('\n')
  if (oldData[oldData.length - 1] === '') oldData.pop() // remove last empty line
  const newFilePath = path.join(__dirname, `../${process.env.DATASETS_DOWNLOAD_PATH}CIS_bdpm.txt`)
  const newData = fs.readFileSync(newFilePath, 'latin1').split('\n')
  if (newData[newData.length - 1] === '') newData.pop() // remove last empty line

  const diffsList = diffArrays(oldData, newData)
  const changes: Changes = { added: [], removed: [], updated: [] }
  for (const change of diffsList) {
    const formattedValue: ObjectLiteral[] = []
    if (change.added === true || change.removed === true) {
      for (const line of change.value) {
        const data = parseDrugSpecificationData(line)
        formattedValue.push(data)
      }
    }
    if (change.added === true) {
      changes.added = [...changes.added, ...formattedValue]
    }
    if (change.removed === true) {
      changes.removed = [...changes.removed, ...formattedValue]
    }
  }
  console.log(`[${moment.utc().toISOString()}] Found ${changes.removed.length} deleted rows and ${changes.added.length} added rows.`)
  console.log(`[${moment.utc().toISOString()}] Detecting updates...`)
  let updatedLines = 0
  for (const removed of changes.removed) {
    const added = changes.added.find((added) => added.id === removed.id)
    if (added != null) {
      // since we can rely on id only, we just need to save the new data
      changes.removed = changes.removed.filter((removed) => removed.id !== added.id)
      updatedLines++
    }
  }
  console.log(`[${moment.utc().toISOString()}] Found ${changes.removed.length} drug specifications to remove, ${changes.added.length - updatedLines} drug specifications to add and ${updatedLines} drug specifications to update.`)
  console.log(`[${moment.utc().toISOString()}] Processing updates...`)
  for (let i = 0; i < changes.removed.length; i += CHUNK_SIZE) {
    const chunk = changes.removed.slice(i, i + CHUNK_SIZE)
    try {
      const result = await DrugSpecificationService.deleteBy(chunk.map((removed) => removed.id))
      console.log(`[${moment.utc().toISOString()}] Deleted ${result.affected} drug specifications data. Ignored lines: ${changes.removed.length - (result.affected ?? 0)}`)
    } catch (error) {
      console.log(`[${moment.utc().toISOString()}] Specification (CIS_bdpm.txt) - Couldn't delete drug specification (${chunk.map((removed) => removed.id).join(', ')}) :`, error)
      console.log(`[${moment.utc().toISOString()}] Continuing...`)
    }
  }
  for (let i = 0; i < changes.added.length; i += CHUNK_SIZE) {
    let ignoredLines = 0
    const chunk = changes.added.slice(i, i + CHUNK_SIZE)
    for (const added of chunk) {
      try {
        await DrugSpecificationService.save(added)
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Specification (CIS_bdpm.txt) - Couldn't create drug specification with id ${added.id} :`, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
      }
    }
    console.log(`[${moment.utc().toISOString()}] Created/updated ${chunk.length} drug specifications data. Ignored lines: ${ignoredLines}`)
  }

  console.log(`[${moment.utc().toISOString()}] Finished updating drug specification data.`)
}

const updateDrugPackageData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Updating drug package data...`)
  const oldFilePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_CIP_bdpm.txt`)
  const oldData = fs.readFileSync(oldFilePath, 'latin1').split('\n')
  if (oldData[oldData.length - 1] === '') oldData.pop() // remove last empty line
  const newFilePath = path.join(__dirname, `../${process.env.DATASETS_DOWNLOAD_PATH}CIS_CIP_bdpm.txt`)
  const newData = fs.readFileSync(newFilePath, 'latin1').split('\n')
  if (newData[newData.length - 1] === '') newData.pop() // remove last empty line

  const diffsList = diffArrays(oldData, newData)
  let ignoredLines = 0
  const changes: Changes = { added: [], removed: [], updated: [] }
  for (const change of diffsList) {
    const formattedValue: ObjectLiteral[] = []
    if (change.added === true || change.removed === true) {
      for (const line of change.value) {
        const data = parseDrugPackageData(line)
        data.drug = await AppDataSource.manager.findOneBy(DrugSpecification, { id: data.drugId })
        if (data.drug === null) {
          console.log(`[${moment.utc().toISOString()}] Package (CIS_CIP_bdpm.txt) - Drug specification with id ${data.drugId} not found`)
          ignoredLines++
          continue
        }
        data.marketingAuthorizationStatus = data.marketingAuthorizationStatus
          .replace("Déclaration d'arrêt de commercialisation", MarketingAuthorizationDeclarationStatus.STOPPED)
          .replace('(le médicament n\'a plus d\'autorisation)', 'pour autorisation retirée')
        formattedValue.push(data)
      }
    }
    if (change.added === true) {
      changes.added = [...changes.added, ...formattedValue]
    }
    if (change.removed === true) {
      changes.removed = [...changes.removed, ...formattedValue]
    }
  }
  console.log(`[${moment.utc().toISOString()}] Found ${changes.removed.length} deleted rows and ${changes.added.length} added rows. Ignored lines: ${ignoredLines}`)
  console.log(`[${moment.utc().toISOString()}] Detecting updates...`)
  let updatedLines = 0
  for (const removed of changes.removed) {
    const added = changes.added.find((added) => added.id === removed.id)
    if (added != null) {
      // since we can rely only on id, we just need to save the new data
      changes.removed = changes.removed.filter((removed) => removed.id !== added.id)
      updatedLines++
    }
  }
  console.log(`[${moment.utc().toISOString()}] Found ${changes.removed.length} drug packages to remove, ${changes.added.length - updatedLines} drug packages to add and ${updatedLines} drug packages to update.`)
  console.log(`[${moment.utc().toISOString()}] Processing updates...`)
  for (let i = 0; i < changes.removed.length; i += CHUNK_SIZE) {
    const chunk = changes.removed.slice(i, i + CHUNK_SIZE)
    try {
      const result = await DrugPackageService.deleteBy(chunk.map((removed) => removed.id))
      console.log(`[${moment.utc().toISOString()}] Deleted ${result.affected} drug packages data. Ignored lines: ${changes.removed.length - (result.affected ?? 0)}`)
    } catch (error) {
      console.log(`[${moment.utc().toISOString()}] Package (CIS_CIP_bdpm.txt) - Couldn't delete drug package (${chunk.map((removed) => removed.id).join(', ')}) :`, error)
      console.log(`[${moment.utc().toISOString()}] Continuing...`)
      ignoredLines++
    }
  }
  for (let i = 0; i < changes.added.length; i += CHUNK_SIZE) {
    ignoredLines = 0
    const chunk = changes.added.slice(i, i + CHUNK_SIZE)
    for (const added of chunk) {
      try {
        await DrugPackageService.save(added)
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Package (CIS_CIP_bdpm.txt) - Couldn't create drug package with id ${added.id} :`, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
      }
    }
    console.log(`[${moment.utc().toISOString()}] Created/updated ${chunk.length} drug packages data. Ignored lines: ${ignoredLines}`)
  }
  console.log(`[${moment.utc().toISOString()}] Finished updating drug package data.`)
}

const updateDrugCompositionData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Updating drug composition data...`)
  const oldFilePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_COMPO_bdpm.txt`)
  const oldData = fs.readFileSync(oldFilePath, 'latin1').split('\n')
  if (oldData[oldData.length - 1] === '') oldData.pop() // remove last empty line
  const newFilePath = path.join(__dirname, `../${process.env.DATASETS_DOWNLOAD_PATH}CIS_COMPO_bdpm.txt`)
  const newData = fs.readFileSync(newFilePath, 'latin1').split('\n')
  if (newData[newData.length - 1] === '') newData.pop() // remove last empty line

  const diffsList = diffArrays(oldData, newData)
  let ignoredLines = 0
  const changes: Changes = { added: [], removed: [], updated: [] }
  for (const change of diffsList) {
    const formattedValue: ObjectLiteral[] = []
    if (change.added === true || change.removed === true) {
      for (const line of change.value) {
        const data = parseDrugCompositionData(line)
        data.drug = await AppDataSource.manager.findOneBy(DrugSpecification, { id: data.drugId })
        if (data.drug === null) {
          console.log(`[${moment.utc().toISOString()}] Composition (CIS_COMPO_bdpm.txt) - Drug specification with id ${data.drugId} not found`)
          ignoredLines++
          continue
        }
        formattedValue.push(data)
      }
    }
    if (change.added === true) {
      changes.added = [...changes.added, ...formattedValue]
    }
    if (change.removed === true) {
      changes.removed = [...changes.removed, ...formattedValue]
    }
  }
  console.log(`[${moment.utc().toISOString()}] Found ${changes.removed.length} deleted rows and ${changes.added.length} added rows. Ignored lines: ${ignoredLines}`)
  console.log(`[${moment.utc().toISOString()}] Processing updates...`)
  for (let i = 0; i < changes.removed.length; i += CHUNK_SIZE) {
    const chunk = changes.removed.slice(i, i + CHUNK_SIZE)
    try {
      const result = await DrugCompositionService.deleteBy(chunk.map((removed) => removed.id))
      console.log(`[${moment.utc().toISOString()}] Deleted ${result.affected} drug compositions data. Ignored lines: ${changes.removed.length - (result.affected ?? 0)}`)
    } catch (error) {
      console.log(`[${moment.utc().toISOString()}] Composition (CIS_COMPO_bdpm.txt) - Couldn't delete drug composition (${chunk.map((removed) => removed.id).join(', ')}) :`, error)
      console.log(`[${moment.utc().toISOString()}] Continuing...`)
    }
  }
  for (let i = 0; i < changes.added.length; i += CHUNK_SIZE) {
    const chunk = changes.added.slice(i, i + CHUNK_SIZE)
    for (const added of chunk) {
      try {
        await DrugCompositionService.create(added)
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Composition (CIS_COMPO_bdpm.txt) - Couldn't create drug composition with id ${added.id} :`, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
      }
    }
    console.log(`[${moment.utc().toISOString()}] Created/updated ${chunk.length} drug compositions data. Ignored lines: ${ignoredLines}`)
  }
  console.log(`[${moment.utc().toISOString()}] Finished updating drug composition data.`)
}

const updateDrugPrescriptionRestrictionData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Updating drug prescription restriction data...`)
  const oldFilePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_CPD_bdpm.txt`)
  const oldData = fs.readFileSync(oldFilePath, 'latin1').split('\n')
  if (oldData[oldData.length - 1] === '') oldData.pop() // remove last empty line
  const newFilePath = path.join(__dirname, `../${process.env.DATASETS_DOWNLOAD_PATH}CIS_CPD_bdpm.txt`)
  const newData = fs.readFileSync(newFilePath, 'latin1').split('\n')
  if (newData[newData.length - 1] === '') newData.pop() // remove last empty line

  const diffsList = diffArrays(oldData, newData)
  let ignoredLines = 0
  const changes: Changes = { added: [], removed: [], updated: [] }
  for (const change of diffsList) {
    const formattedValue: ObjectLiteral[] = []
    if (change.added === true || change.removed === true) {
      for (const line of change.value) {
        const data = parseDrugPrescriptionRestrictionData(line)
        data.drug = await AppDataSource.manager.findOneBy(DrugSpecification, { id: data.drugId })
        if (data.drug === null) {
          console.log(`[${moment.utc().toISOString()}] Prescription restriction (CIS_CPD_bdpm.txt) - Drug specification with id ${data.drugId} not found`)
          ignoredLines++
          continue
        }
        formattedValue.push(data)
      }
    }
    if (change.added === true) {
      changes.added = [...changes.added, ...formattedValue]
    }
    if (change.removed === true) {
      changes.removed = [...changes.removed, ...formattedValue]
    }
  }
  console.log(`[${moment.utc().toISOString()}] Found ${changes.removed.length} deleted rows and ${changes.added.length} added rows. Ignored lines: ${ignoredLines}`)
  console.log(`[${moment.utc().toISOString()}] Detecting updates...`)
  let updatedLines = 0
  for (const removed of changes.removed) {
    const added = changes.added.find((added) => added.drugId === removed.drugId)
    if (added != null) {
      // since we can rely on drugId only, we just need to save the new data
      changes.removed = changes.removed.filter((removed) => removed.drugId !== added.drugId)
      updatedLines++
    }
  }
  console.log(`[${moment.utc().toISOString()}] Found ${changes.removed.length} drug prescription restrictions to remove, ${changes.added.length - updatedLines} drug prescription restrictions to add and ${updatedLines} drug prescription restrictions to update.`)
  console.log(`[${moment.utc().toISOString()}] Processing updates...`)
  ignoredLines = 0
  for (let i = 0; i < changes.removed.length; i += CHUNK_SIZE) {
    ignoredLines = 0
    const chunk = changes.removed.slice(i, i + CHUNK_SIZE)
    for (const removed of chunk) {
      try {
        await DrugSpecificationService.update(removed.drugId, { prescriptionRestriction: '' })
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Prescription restriction (CIS_CPD_bdpm.txt) - Couldn't delete drug prescription restriction with id ${removed.drugId} :`, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
      }
    }
    console.log(`[${moment.utc().toISOString()}] Deleted ${chunk.length} drug prescription restrictions data. Ignored lines: ${ignoredLines}`)
  }
  for (let i = 0; i < changes.added.length; i += CHUNK_SIZE) {
    ignoredLines = 0
    const chunk = changes.added.slice(i, i + CHUNK_SIZE)
    for (const added of chunk) {
      try {
        await DrugSpecificationService.update(added.drugId, { prescriptionRestriction: added.prescriptionRestriction })
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Prescription restriction (CIS_CPD_bdpm.txt) - Couldn't create drug prescription restriction with id ${added.drugId} :`, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
      }
    }
    console.log(`[${moment.utc().toISOString()}] Created/updated ${chunk.length} drug prescription restrictions data. Ignored lines: ${ignoredLines}`)
  }
  console.log(`[${moment.utc().toISOString()}] Finished updating drug prescription restriction data.`)
}

const updateGenericData = async (): Promise<void> => {
  console.log(`[${moment.utc().toISOString()}] Updating generic data...`)
  const oldFilePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}CIS_GENER_bdpm.txt`)
  const oldData = fs.readFileSync(oldFilePath, 'latin1').split('\n')
  if (oldData[oldData.length - 1] === '') oldData.pop() // remove last empty line
  const newFilePath = path.join(__dirname, `../${process.env.DATASETS_DOWNLOAD_PATH}CIS_GENER_bdpm.txt`)
  const newData = fs.readFileSync(newFilePath, 'latin1').split('\n')
  if (newData[newData.length - 1] === '') newData.pop() // remove last empty line

  const diffsList = diffArrays(oldData, newData)
  let ignoredLines = 0
  const changes: Changes = { added: [], removed: [], updated: [] }
  for (const change of diffsList) {
    const formattedValue: ObjectLiteral[] = []
    if (change.added === true || change.removed === true) {
      for (const line of change.value) {
        const data = parseGenericData(line)
        data.drug = await AppDataSource.manager.findOneBy(DrugSpecification, { id: data.drugId })
        if (data.drug === null) {
          console.log(`[${moment.utc().toISOString()}] Generics (CIS_GENER_bdpm.txt) - Drug specification with id ${data.drugId} not found`)
          ignoredLines++
          continue
        }
        data.generic = await GenericService.save({ id: data.id, name: data.name })
        formattedValue.push(data)
      }
    }
    if (change.added === true) {
      changes.added = [...changes.added, ...formattedValue]
    }
    if (change.removed === true) {
      changes.removed = [...changes.removed, ...formattedValue]
    }
  }
  console.log(`[${moment.utc().toISOString()}] Found ${changes.removed.length} deleted rows and ${changes.added.length} added rows. Ignored lines: ${ignoredLines}`)
  console.log(`[${moment.utc().toISOString()}] Detecting updates...`)
  let updatedLines = 0
  for (const removed of changes.removed) {
    const added = changes.added.find((added) => added.id === removed.id && added.drugId === removed.drugId)
    if (added != null) {
      // since we can rely on generic id and drug id only, we just need to save the new data
      changes.removed = changes.removed.filter((removed) => removed.id !== added.id && removed.drugId !== added.drugId)
      updatedLines++
    }
  }
  console.log(`[${moment.utc().toISOString()}] Found ${changes.removed.length} drug generics to remove, ${changes.added.length - updatedLines} drug generics to add and ${updatedLines} drug generics to update.`)
  console.log(`[${moment.utc().toISOString()}] Processing updates...`)
  for (let i = 0; i < changes.removed.length; i += CHUNK_SIZE) {
    const chunk = changes.removed.slice(i, i + CHUNK_SIZE)
    try {
      const result = await DrugGenericService.deleteBy(chunk.map((removed) => removed.id))
      console.log(`[${moment.utc().toISOString()}] Deleted ${result.affected} drug generics data. Ignored lines: ${changes.removed.length - (result.affected ?? 0)}`)
    } catch (error) {
      console.log(`[${moment.utc().toISOString()}] Generics (CIS_GENER_bdpm.txt) - Couldn't delete drug generic (${chunk.map((removed) => removed.id).join(', ')}) :`, error)
      console.log(`[${moment.utc().toISOString()}] Continuing...`)
    }
  }
  for (let i = 0; i < changes.added.length; i += CHUNK_SIZE) {
    ignoredLines = 0
    const chunk = changes.added.slice(i, i + CHUNK_SIZE)
    for (const added of chunk) {
      try {
        await DrugGenericService.save({ drug: added.drug, generic: added.generic, type: added.type, rank: added.rank })
      } catch (error) {
        console.log(`[${moment.utc().toISOString()}] Generics (CIS_GENER_bdpm.txt) - Couldn't create drug generic with id ${added.id} :`, error)
        console.log(`[${moment.utc().toISOString()}] Continuing...`)
        ignoredLines++
      }
    }
    console.log(`[${moment.utc().toISOString()}] Created/updated ${chunk.length} drug generics data. Ignored lines: ${ignoredLines}`)
  }
  console.log(`[${moment.utc().toISOString()}] Finished updating drug generics data.`)
}

// =====================================================================================================================
// ================================================= DELETE FUNCTIONS ==================================================
// =====================================================================================================================

const deleteDrugTables = async (): Promise<void> => {
  const tables = [
    'drug_composition',
    'drug_generic',
    'drug_package',
    'drug_specification',
    'generic'
  ]
  for (const table of tables) {
    try {
      process.stdout.write(`[${moment.utc().toISOString()}] ${messageWithDots(`Deleting previous data from ${table}`)}`)
      await AppDataSource.manager.query(`DELETE FROM ${table}`)
      process.stdout.write('SUCCESS\n')
    } catch (error) {
      process.stdout.write('FAILED\n')
    }
  }
}

// =====================================================================================================================
// ================================================== FILE FUNCTIONS ===================================================
// =====================================================================================================================

const retrieveDataset = async (fileName: string): Promise<void> => {
  const url = `${process.env.DATASETS_DOWNLOAD_URL}${fileName}`
  const newFilePath = path.join(__dirname, `../${process.env.DATASETS_DOWNLOAD_PATH}`, fileName)

  await new Promise<void>((resolve, reject) => {
    https.get(url, (res) => {
      const contentDisposition = res.headers['content-disposition']
      if (contentDisposition == null || !contentDisposition.includes('attachment')) {
        console.log(`[${moment.utc().toISOString()}] ${fileName} (1): url does not contain a downloadable file`)
        console.log(`[${moment.utc().toISOString()}] ${fileName} (2): content appears to be "${res.headers['content-type']}"`)
        console.log(`[${moment.utc().toISOString()}] ${fileName} (3): given url is ${url}`)
        reject(new Error('Not a downloadable file'))
        return
      }

      const fileStream = fs.createWriteStream(newFilePath)
      res.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        console.log(`[${moment.utc().toISOString()}] ${fileName}: file downloaded.`)
        resolve()
      })

      fileStream.on('error', (err) => {
        console.log(`[${moment.utc().toISOString()}] ${fileName}: failed to download file`)
        reject(err)
      })
    })
  })
}

const retrieveAllDatasets = async (): Promise<void> => {
  const datasetsFiles = [
    'CIS_bdpm.txt',
    'CIS_CIP_bdpm.txt',
    'CIS_COMPO_bdpm.txt',
    'CIS_GENER_bdpm.txt',
    'CIS_CPD_bdpm.txt'
  ]
  await Promise.all(datasetsFiles.map(retrieveDataset))
}

const replaceOldFilesByNewest = async (): Promise<void> => {
  const datasetsFiles = [
    'CIS_bdpm.txt',
    'CIS_CIP_bdpm.txt',
    'CIS_COMPO_bdpm.txt',
    'CIS_GENER_bdpm.txt',
    'CIS_CPD_bdpm.txt'
  ]
  for (const fileName of datasetsFiles) {
    const oldFilePath = path.join(__dirname, `../${process.env.DATASETS_IMPORTED_PATH}`, fileName)
    const newFilePath = path.join(__dirname, `../${process.env.DATASETS_DOWNLOAD_PATH}`, fileName)
    if (fs.existsSync(newFilePath)) {
      fs.renameSync(newFilePath, oldFilePath)
    }
  }
}
// =====================================================================================================================
// ================================================== MAIN FUNCTIONS ===================================================
// =====================================================================================================================

async function clearData (): Promise<void> {
  const start = moment.utc()

  await deleteDrugTables()

  console.log(`[${moment.utc().toISOString()}] Finished clearing data in ${moment.utc().diff(start, 'seconds', true).toFixed(2)} seconds`)
}

async function importData (): Promise<void> {
  const start = moment.utc()

  await importDrugSpecificationData()
  await importDrugPackageData()
  await importDrugCompositionData()
  await importDrugPrescriptionRestrictionData()
  await importGenericData()

  console.log(`[${moment.utc().toISOString()}] Finished importing data in ${moment.utc().diff(start, 'seconds', true).toFixed(2)} seconds`)
}

async function updateData (): Promise<void> {
  const start = moment.utc()

  await retrieveAllDatasets()

  await updateDrugSpecificationData()
  await updateDrugPackageData()
  await updateDrugCompositionData()
  await updateDrugPrescriptionRestrictionData()
  await updateGenericData()

  await replaceOldFilesByNewest()

  console.log(`[${moment.utc().toISOString()}] Finished updating data in ${moment.utc().diff(start, 'seconds', true).toFixed(2)} seconds`)
}

export { clearData, importData, updateData }
