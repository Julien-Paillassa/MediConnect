import { type ObjectLiteral } from 'typeorm'
import { type User } from 'src/entity/User'

export interface PaginationData<Entity extends ObjectLiteral> {
  total: number
  page: number
  count: number
  items: Entity[]
}

export type order = 'ASC' | 'DESC'

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User
  }
}
