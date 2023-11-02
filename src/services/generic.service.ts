import { type ObjectLiteral } from 'typeorm'
import AppDataSource from '../data-source'
import { type order, type PaginationData } from 'mediconnect'
import { Generic } from '../entity/Generic'
import { applyFiltersOnSelectQuery } from '../utils/query'

export async function list (
  page: number = 0,
  size: number = 10,
  sort: string = 'id',
  order: order = 'ASC',
  filters: ObjectLiteral
): Promise<PaginationData<Generic>> {
  const aliasName = AppDataSource.manager.connection.getMetadata(Generic).tableName
  const query = AppDataSource.manager.createQueryBuilder(Generic, aliasName)
  const queryWithFilters = applyFiltersOnSelectQuery(Generic, query, filters)
  const [items, total] = await queryWithFilters
    .orderBy(`${aliasName}.${sort}`, order, 'NULLS LAST')
    .skip(size * page)
    .take(size)
    .getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<Generic> {
  return await AppDataSource.manager.findOneOrFail(Generic, { where: { id } })
}
