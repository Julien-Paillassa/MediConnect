import moment from 'moment'
import AppDataSource from '../data-source'
import { messageWithDots } from '../helpers/string.helper'

export function dataSourceMiddleware () {
  return function (func: (...args: any[]) => any) {
    const dbWasInitialized = AppDataSource.manager.connection.isInitialized

    return async (...args: any[]) => {
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

      const result = await func(...args)

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

      return result
    }
  }
}
