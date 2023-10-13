import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'
import { Subscription } from './entity/Subscription'
import { ApiKey } from './entity/ApiKey'

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'mediconnect',
  username: 'postgres',
  password: 'postgres',
  entities: [User, Subscription, ApiKey],
  synchronize: true,
  logging: false
})

export default AppDataSource
