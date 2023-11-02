import { type ObjectLiteral } from 'typeorm'
import AppDataSource from '../data-source'
import { type order, type PaginationData } from 'mediconnect'
import { applyFiltersOnSelectQuery } from '../utils/query'
import { DrugPackage } from '../entity/DrugPackage'

export async function list (
  page: number = 0,
  size: number = 10,
  sort: string = 'id',
  order: order = 'ASC',
  filters: ObjectLiteral
): Promise<PaginationData<DrugPackage>> {
  const aliasName = AppDataSource.manager.connection.getMetadata(DrugPackage).tableName
  const query = AppDataSource.manager.createQueryBuilder(DrugPackage, aliasName)
  const queryWithFilters = applyFiltersOnSelectQuery(DrugPackage, query, filters)
  const [items, total] = await queryWithFilters
    .orderBy(`${aliasName}.${sort}`, order, 'NULLS LAST')
    .skip(size * page)
    .take(size)
    .getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugPackage> {
  return await AppDataSource.manager.findOneOrFail(DrugPackage, { where: { id } })
}
