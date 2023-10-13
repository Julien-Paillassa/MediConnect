import * as dotenv from 'dotenv'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

dotenv.config()

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'mediconnect-db',
  port: 5432,
  database: 'mediconnect',
  username: 'postgres',
  password: 'postgres',
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  migrationsRun: true,
  synchronize: false,
  logging: Boolean(process.env.ORM_LOGGING) ?? false,
  subscribers: []
})

export default AppDataSource
