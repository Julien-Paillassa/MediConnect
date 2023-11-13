import * as dotenv from 'dotenv'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import path = require('path')

dotenv.config()

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'mediconnect-db',
  port: Number(process.env.DB_PORT) ?? 5432,
  database: process.env.DB_NAME ?? 'mediconnect',
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  entities: [path.join(__dirname, 'entity/**/*.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations/**/*.{ts,js}')],
  migrationsRun: true,
  synchronize: false,
  logging: Boolean(process.env.ORM_LOGGING) ?? false,
  subscribers: []
})

export default AppDataSource
