import { Command } from 'commander'
import * as DatasetHelper from './src/helpers/dataset.helper'
import { dataSourceMiddleware } from './src/middlewares/data-source.middleware'

const program = new Command()
const dsMiddleware = dataSourceMiddleware()

program
  .command('clear-dataset')
  .description('Clear dataset from database')
  .action(async () => { await dsMiddleware(DatasetHelper.clearData)() })

program
  .command('import-dataset')
  .description('Retrieve dataset from local file in datasets/ and import into database')
  .action(async () => { await dsMiddleware(DatasetHelper.importData)() })

program
  .command('update-dataset')
  .description('Retrieve dataset from government API and update database')
  .action(async () => { await dsMiddleware(DatasetHelper.updateData)() })

program.parse(process.argv)
