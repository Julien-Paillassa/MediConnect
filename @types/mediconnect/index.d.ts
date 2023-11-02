import { type ObjectLiteral } from 'typeorm'

export interface PaginationData<Entity extends ObjectLiteral> {
  total: number
  page: number
  count: number
  items: Entity[]
}

export type order = 'ASC' | 'DESC'
