import * as dotenv from 'dotenv'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import path = require('path')

dotenv.config()

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'mediconnect-db',
  port: 5432,
  database: 'mediconnect',
  username: 'postgres',
  password: 'postgres',
  entities: [path.join(__dirname, 'entity/**/*.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations/**/*.{ts,js}')],
  migrationsRun: true,
  synchronize: false,
  logging: Boolean(process.env.ORM_LOGGING) ?? false,
  subscribers: []
})

export default AppDataSource
