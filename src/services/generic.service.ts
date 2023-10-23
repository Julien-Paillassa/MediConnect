import { type FindOptionsWhere } from 'typeorm'
import AppDataSource from '../data-source'
import { type PaginationData } from 'mediconnect'
import { Generic } from '../entity/Generic'
import { applyFiltersOnSelectQuery } from '../utils/query'

export async function list (
  page: number = 0,
  size: number = 10,
  filters: FindOptionsWhere<Generic>
): Promise<PaginationData<Generic>> {
  const query = AppDataSource.manager.createQueryBuilder(Generic, 'generic')
  const queryWithFilters = applyFiltersOnSelectQuery('generic', query, filters)
  const [items, total] = await queryWithFilters.skip(size * page).take(size).getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<Generic> {
  return await AppDataSource.manager.findOneOrFail(Generic, { where: { id } })
}
