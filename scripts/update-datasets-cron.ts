import * as dotenv from 'dotenv'
import moment from 'moment'
import cron from 'node-cron'
import * as DatasetHelper from '../src/helpers/dataset.helper'
import { dataSourceMiddleware } from '../src/middlewares/data-source.middleware'

dotenv.config()

const dsMiddleware = dataSourceMiddleware()
console.log(`[${moment.utc().toISOString()}] Schedule cron job to update drug datasets with interval ${process.env.DATASETS_UPDATE_CRON_INTERVAL ?? '* */12 * * *'}`)

cron.schedule(
  process.env.DATASETS_UPDATE_CRON_INTERVAL ?? '* */12 * * *',
  () => {
    console.log(`[${moment.utc().toISOString()}] Start cron job to update datasets`)
    dsMiddleware(DatasetHelper.updateData)()
      .then(() => {
        console.log(`[${moment.utc().toISOString()}] End cron job to update datasets`)
      })
      .catch((err) => {
        console.error(`[${moment.utc().toISOString()}] Error during cron job to update datasets`, err)
      })
  }
)
