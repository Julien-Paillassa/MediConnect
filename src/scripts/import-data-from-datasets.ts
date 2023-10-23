import * as fs from 'fs'
import moment from 'moment'
import path from 'path'
import AppDataSource from '../data-source'
import { DrugComposition, type SubstanceNatureType } from '../entity/DrugComposition'
import { DrugGeneric, type GenericType } from '../entity/DrugGeneric'
import { DrugPackage, MarketingAuthorizationDeclarationStatus, type PackageStatus } from '../entity/DrugPackage'
import { DrugSpecification, type MarketingAuthorizationStatus, type OriginalDatabaseStatus } from '../entity/DrugSpecification'
import { Generic } from '../entity/Generic'

const CHUNK_SIZE = 2500

const importDrugSpecificationData = async (): Promise<void> => {
  console.log('Importing drug specification data...')
  const filePath = path.join(__dirname, '../datasets/CIS_bdpm.txt')
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const fields = line.split('\t')
        const drugSpecification = new DrugSpecification()
        drugSpecification.id = Number(fields[0])
        drugSpecification.name = fields[1]
        drugSpecification.form = fields[2]
        drugSpecification.administrations = fields[3].split(';')
        drugSpecification.marketingAuthorizationStatus = fields[4] as MarketingAuthorizationStatus
        drugSpecification.marketingAuthorizationProcedure = fields[5]
        drugSpecification.isBeingMarketed = fields[6] === 'Commercialisée'
        drugSpecification.marketingAuthorizationDate = moment.utc(fields[7], 'DD/MM/YYYY').toDate()
        if (fields[8] !== '') drugSpecification.ogDbStatus = fields[8] as OriginalDatabaseStatus
        drugSpecification.europeanAuthorizationNumber = fields[9]
        drugSpecification.holders = fields[10].split(';')
        drugSpecification.reinforcedMonitoring = fields[11] === 'Oui'
        await AppDataSource.manager.save(drugSpecification)
      } catch (error) {
        console.log(`Specification (CIS_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log('Continuing...')
        ignoredLines++
        continue
      }
    }
    console.log(`Finished importing ${chunkData.length} drug specifications data. Ignored lines: ${ignoredLines}`)
  }
}

const importDrugPackageData = async (): Promise<void> => {
  console.log('Importing drug package data...')
  const filePath = path.join(__dirname, '../datasets/CIS_CIP_bdpm.txt')
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const fields = line.split('\t')
        const drugSpecification = await AppDataSource.manager.findOneBy(DrugSpecification, {
          id: Number(fields[0])
        })
        if (drugSpecification === null) {
          console.log(`Package (CIS_CIP_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - Drug specification with id ${fields[0]} not found`)
          ignoredLines++
          continue
        }
        const drugPackage = new DrugPackage()
        drugPackage.id = Number(fields[1])
        drugPackage.longId = Number(fields[6])
        drugPackage.drug = drugSpecification
        drugPackage.name = fields[2]
        drugPackage.status = fields[3] as PackageStatus
        const status = fields[4]
          .replace("Déclaration d'arrêt de commercialisation", MarketingAuthorizationDeclarationStatus.STOPPED)
          .replace('(le médicament n\'a plus d\'autorisation)', 'pour autorisation retirée')
        drugPackage.marketingAuthorizationStatus = status as MarketingAuthorizationDeclarationStatus
        drugPackage.marketingAuthorizationDeclarationDate = moment.utc(fields[5], 'DD/MM/YYYY').toDate()
        drugPackage.isAgreedToCommunities = fields[7] === 'Oui'
        if (!isNaN(Number(fields[8]))) drugPackage.refundRate = Number(fields[8])
        if (!isNaN(Number(fields[10])))drugPackage.price = Number(fields[10])
        drugPackage.refundInformation = fields[12]
        await AppDataSource.manager.save(drugPackage)
      } catch (error) {
        console.log(`Package (CIS_CIP_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log('Continuing...')
        ignoredLines++
        continue
      }
    }
    console.log(`Finished importing ${chunkData.length} drug packages data. Ignored lines: ${ignoredLines}`)
  }
}

const importDrugCompositionData = async (): Promise<void> => {
  console.log('Importing drug composition data...')
  const filePath = path.join(__dirname, '../datasets/CIS_COMPO_bdpm.txt')
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const fields = line.split('\t')
        const drugSpecification = await AppDataSource.manager.findOneBy(DrugSpecification, {
          id: Number(fields[0])
        })
        if (drugSpecification === null) {
          console.log(`Composition (CIS_COMPO_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - Drug specification with id ${fields[0]} not found`)
          ignoredLines++
          continue
        }

        const drugComposition = new DrugComposition()
        drugComposition.drug = drugSpecification
        drugComposition.name = fields[1]
        drugComposition.substanceCode = fields[2]
        drugComposition.substanceName = fields[3]
        drugComposition.substanceDosage = fields[4]
        drugComposition.substanceDosageReference = fields[5]
        drugComposition.substanceNature = fields[6] as SubstanceNatureType
        drugComposition.substancesLinkNumber = Number(fields[7])

        await AppDataSource.manager.save(drugComposition)
      } catch (error) {
        console.log(`Composition (CIS_COMPO_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log('Continuing...')
        ignoredLines++
        continue
      }
    }
    console.log(`Finished importing ${chunkData.length} drug compositions data. Ignored lines: ${ignoredLines}`)
  }
}

const importDrugPrescriptionRestrictionData = async (): Promise<void> => {
  console.log('Importing drug prescription restriction data...')
  const filePath = path.join(__dirname, '../datasets/CIS_CPD_bdpm.txt')
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const fields = line.split('\t')
        const drugSpecification = await AppDataSource.manager.findOneBy(DrugSpecification, {
          id: Number(fields[0])
        })
        if (drugSpecification === null) {
          console.log(`Prescription restriction (CIS_CPD_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - Drug specification with id ${fields[0]} not found`)
          ignoredLines++
          continue
        }
        drugSpecification.prescriptionRestriction = fields[1]
        await AppDataSource.manager.save(drugSpecification)
      } catch (error) {
        console.log(`Prescription restriction (CIS_CPD_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log('Continuing...')
        ignoredLines++
        continue
      }
    }
    console.log(`Finished importing ${chunkData.length} drug prescription restrictions data. Ignored lines: ${ignoredLines}`)
  }
}

const importGenericData = async (): Promise<void> => {
  console.log('Importing generic data...')
  const filePath = path.join(__dirname, '../datasets/CIS_GENER_bdpm.txt')
  const data = fs.readFileSync(filePath, 'latin1').split('\n')
  if (data[data.length - 1] === '') data.pop() // remove last empty line
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunkData = data.slice(i, i + CHUNK_SIZE)
    let ignoredLines = 0
    for (const [index, line] of chunkData.entries()) {
      try {
        const fields = line.split('\t')

        const drugSpecification = await AppDataSource.manager.findOneBy(DrugSpecification, {
          id: Number(fields[2])
        })
        if (drugSpecification === null) {
          console.log(`Generics (CIS_GENER_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - Drug specification with id ${fields[2]} not found`)
          ignoredLines++
          continue
        }

        let generic = await AppDataSource.manager.findOneBy(Generic, { id: Number(fields[0]) })
        if (generic === null) {
          generic = new Generic()
          generic.id = Number(fields[0])
          generic.name = fields[1]
          generic = await AppDataSource.manager.save(generic)
        }

        const drugGeneric = new DrugGeneric()
        drugGeneric.drug = drugSpecification
        drugGeneric.generic = generic
        drugGeneric.type = Number(fields[3]) as GenericType
        drugGeneric.rank = Number(fields[4])
        await AppDataSource.manager.save(drugGeneric)
      } catch (error) {
        console.log(`Generics (CIS_GENER_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log('Continuing...')
        ignoredLines++
        continue
      }
    }
    console.log(`Finished importing ${chunkData.length} drug generics data. Ignored lines: ${ignoredLines}`)
  }
}

async function importData (): Promise<void> {
  if (!AppDataSource.manager.connection.isInitialized) {
    process.stdout.write('Initializing database connection............')
    await AppDataSource.initialize()
    process.stdout.write('SUCCESS\n')
  }
  await importDrugSpecificationData()
  await importDrugPackageData()
  await importDrugCompositionData()
  await importDrugPrescriptionRestrictionData()
  await importGenericData()
}
void importData()
  .then(() => { console.info('Data import complete.') })
  .catch((error) => { console.error('Data import failed: ', error) })
  .finally(() => {
    process.stdout.write('Closing database connection............')
    AppDataSource.manager.connection.destroy().then(() => {
      process.stdout.write('SUCCESS\n')
    }).catch((error) => {
      process.stdout.write('FAILED\n')
      console.error(error)
    })
  })
