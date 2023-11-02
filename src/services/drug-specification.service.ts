import { type ObjectLiteral } from 'typeorm'
import AppDataSource from '../data-source'
import { type order, type PaginationData } from 'mediconnect'
import { DrugSpecification } from '../entity/DrugSpecification'
import { applyFiltersOnSelectQuery } from '../utils/query'

export async function list (
  page: number = 0,
  size: number = 10,
  sort: string = 'id',
  order: order = 'ASC',
  filters: ObjectLiteral
): Promise<PaginationData<DrugSpecification>> {
  const aliasName = AppDataSource.manager.connection.getMetadata(DrugSpecification).tableName
  const query = AppDataSource.manager.createQueryBuilder(DrugSpecification, aliasName)
  const queryWithFilters = applyFiltersOnSelectQuery(DrugSpecification, query, filters)
  const [items, total] = await queryWithFilters
    .orderBy(`${aliasName}.${sort}`, order, 'NULLS LAST')
    .skip(size * page)
    .take(size)
    .getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugSpecification> {
  return await AppDataSource.manager.findOneOrFail(DrugSpecification, { where: { id } })
}
