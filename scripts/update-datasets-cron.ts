import cron from 'node-cron'
import * as DatasetHelper from '../src/helpers/dataset.helper'
import { dataSourceMiddleware } from '../src/middlewares/data-source.middleware'
import moment from 'moment'

const dsMiddleware = dataSourceMiddleware()

cron.schedule('* */12 * * *', () => {
  console.log(`[${moment.utc().toISOString()}] Start cron job to update datasets`)
  dsMiddleware(DatasetHelper.updateData)()
    .then(() => {
      console.log(`[${moment.utc().toISOString()}] End cron job to update datasets`)
    })
    .catch((err) => {
      console.error(`[${moment.utc().toISOString()}] Error during cron job to update datasets`, err)
    })
})
