import { type FindOptionsWhere } from 'typeorm'
import AppDataSource from '../data-source'
import { type PaginationData } from 'mediconnect'
import { applyFiltersOnSelectQuery } from '../utils/query'
import { DrugGeneric } from '../entity/DrugGeneric'

export async function list (
  page: number = 0,
  size: number = 10,
  filters: FindOptionsWhere<DrugGeneric>
): Promise<PaginationData<DrugGeneric>> {
  const query = AppDataSource.manager.createQueryBuilder(DrugGeneric, 'drug_generic')
  const queryWithFilters = applyFiltersOnSelectQuery(DrugGeneric, query, filters)
  const [items, total] = await queryWithFilters.skip(size * page).take(size).getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugGeneric> {
  return await AppDataSource.manager.findOneOrFail(DrugGeneric, { where: { id } })
}
