import { Command } from 'commander'

import * as DatasetHelper from './src/helpers/dataset.helper'

const program = new Command()

program
  .command('import-dataset')
  .description('Retrieve dataset from local file in datasets/ and import into database')
  .action(DatasetHelper.importData)

program
  .command('update-dataset')
  .description('Retrieve dataset from government API and update database')
  .action(DatasetHelper.updateData)

program.parse(process.argv)
