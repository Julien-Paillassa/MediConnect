import * as fs from 'fs'
import https from 'https'
import moment from 'moment'
import path from 'path'
import AppDataSource from '../data-source'
import { DrugComposition, type SubstanceNatureType } from '../entity/DrugComposition'
import { DrugGeneric, type GenericType } from '../entity/DrugGeneric'
import { DrugPackage, MarketingAuthorizationDeclarationStatus, type PackageStatus } from '../entity/DrugPackage'
import { DrugSpecification, type MarketingAuthorizationStatus, type OriginalDatabaseStatus } from '../entity/DrugSpecification'
import { Generic } from '../entity/Generic'

const CHUNK_SIZE = 2500

// =====================================================================================================================
// ================================================ INTERNAL FUNCTIONS =================================================
// =====================================================================================================================

const messageWithDots = (message: string): string => message + '.'.repeat(50 - message.length)

const importDrugSpecificationData = async (): Promise<void> => {
  console.log(`[${moment.utc().format()}] Importing drug specification data...`)
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
        console.log(`[${moment.utc().format()}] Specification (CIS_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log(`[${moment.utc().format()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().format()}] Finished importing ${chunkData.length} drug specifications data. Ignored lines: ${ignoredLines}`)
  }
}

const importDrugPackageData = async (): Promise<void> => {
  console.log(`[${moment.utc().format()}] Importing drug package data...`)
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
          console.log(`[${moment.utc().format()}] Package (CIS_CIP_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - Drug specification with id ${fields[0]} not found`)
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
        console.log(`[${moment.utc().format()}] Package (CIS_CIP_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log(`[${moment.utc().format()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().format()}] Finished importing ${chunkData.length} drug packages data. Ignored lines: ${ignoredLines}`)
  }
}

const importDrugCompositionData = async (): Promise<void> => {
  console.log(`[${moment.utc().format()}] Importing drug composition data...`)
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
          console.log(`[${moment.utc().format()}] Composition (CIS_COMPO_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - Drug specification with id ${fields[0]} not found`)
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
        console.log(`[${moment.utc().format()}] Composition (CIS_COMPO_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log(`[${moment.utc().format()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().format()}] Finished importing ${chunkData.length} drug compositions data. Ignored lines: ${ignoredLines}`)
  }
}

const importDrugPrescriptionRestrictionData = async (): Promise<void> => {
  console.log(`[${moment.utc().format()}] Importing drug prescription restriction data...`)
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
          console.log(`[${moment.utc().format()}] Prescription restriction (CIS_CPD_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - Drug specification with id ${fields[0]} not found`)
          ignoredLines++
          continue
        }
        drugSpecification.prescriptionRestriction = fields[1]
        await AppDataSource.manager.save(drugSpecification)
      } catch (error) {
        console.log(`[${moment.utc().format()}] Prescription restriction (CIS_CPD_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log(`[${moment.utc().format()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().format()}] Finished importing ${chunkData.length} drug prescription restrictions data. Ignored lines: ${ignoredLines}`)
  }
}

const importGenericData = async (): Promise<void> => {
  console.log(`[${moment.utc().format()}] Importing generic data...`)
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
          console.log(`[${moment.utc().format()}] Generics (CIS_GENER_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - Drug specification with id ${fields[2]} not found`)
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
        console.log(`[${moment.utc().format()}] Generics (CIS_GENER_bdpm.txt, l.${(i * CHUNK_SIZE) + index + 1}) - `, error)
        console.log(`[${moment.utc().format()}] Continuing...`)
        ignoredLines++
        continue
      }
    }
    console.log(`[${moment.utc().format()}] Finished importing ${chunkData.length} drug generics data. Ignored lines: ${ignoredLines}`)
  }
}

const retrieveDataset = async (fileName: string): Promise<void> => {
  const url = `https://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=${fileName}`
  await new Promise<void>((resolve, reject) => {
    https.get(url, (res) => {
      const contentDisposition = res.headers['content-disposition']
      if (contentDisposition == null || !contentDisposition.includes('attachment')) {
        console.log(`[${moment.utc().format()}] ${fileName} (1): url does not contain a downloadable file`)
        console.log(`[${moment.utc().format()}] ${fileName} (2): content appears to be "${res.headers['content-type']}"`)
        console.log(`[${moment.utc().format()}] ${fileName} (3): given url is ${url}`)
        reject(new Error('Not a downloadable file'))
        return
      }

      const filePath = path.join(__dirname, '../datasets', fileName)
      const fileStream = fs.createWriteStream(filePath)
      res.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        console.log(`[${moment.utc().format()}] ${fileName}: file downloaded.`)
        resolve()
      })

      fileStream.on('error', (err) => {
        console.log(`[${moment.utc().format()}] ${fileName}: failed to download file`)
        reject(err)
      })
    })
  })
}

const deletePreviousData = async (): Promise<void> => {
  const tables = [
    'drug_composition',
    'drug_generic',
    'drug_package',
    'drug_specification',
    'generic'
  ]
  for (const table of tables) {
    try {
      process.stdout.write(`[${moment.utc().format()}] ${messageWithDots(`Deleting previous data from ${table}`)}`)
      await AppDataSource.manager.query(`DELETE FROM ${table}`)
      process.stdout.write('SUCCESS\n')
    } catch (error) {
      process.stdout.write('FAILED\n')
    }
  }
}

// =====================================================================================================================
// ================================================== MAIN FUNCTIONS ===================================================
// =====================================================================================================================

async function importData (): Promise<void> {
  const dbWasInitialized = AppDataSource.manager.connection.isInitialized
  if (!dbWasInitialized) {
    process.stdout.write(`[${moment.utc().format()}] ${messageWithDots('Initializing database connection')}`)
    try {
      await AppDataSource.initialize()
      process.stdout.write('SUCCESS\n')
    } catch (error) {
      process.stdout.write('FAILED\n')
      throw error
    }
  }

  await importDrugSpecificationData()
  await importDrugPackageData()
  await importDrugCompositionData()
  await importDrugPrescriptionRestrictionData()
  await importGenericData()

  if (!dbWasInitialized) {
    process.stdout.write(`[${moment.utc().format()}] ${messageWithDots('Closing database connection')}`)
    try {
      await AppDataSource.manager.connection.destroy()
      process.stdout.write('SUCCESS\n')
    } catch (error) {
      process.stdout.write('FAILED\n')
      throw error
    }
  }
}

async function updateData (): Promise<void> {
  const dbWasInitialized = AppDataSource.manager.connection.isInitialized
  if (!dbWasInitialized) {
    process.stdout.write(`[${moment.utc().format()}] ${messageWithDots('Initializing database connection')}`)
    try {
      await AppDataSource.initialize()
      process.stdout.write('SUCCESS\n')
    } catch (error) {
      process.stdout.write('FAILED\n')
      throw error
    }
  }

  await deletePreviousData()

  const datasetsFiles = [
    'CIS_bdpm.txt',
    'CIS_CIP_bdpm.txt',
    'CIS_COMPO_bdpm.txt',
    'CIS_GENER_bdpm.txt',
    'CIS_CPD_bdpm.txt'
  ]
  await Promise.all(datasetsFiles.map(retrieveDataset))

  await importData()

  if (!dbWasInitialized) {
    process.stdout.write(`[${moment.utc().format()}] ${messageWithDots('Closing database connection')}`)
    try {
      await AppDataSource.manager.connection.destroy()
      process.stdout.write('SUCCESS\n')
    } catch (error) {
      process.stdout.write('FAILED\n')
      throw error
    }
  }
}

export { importData, updateData }
