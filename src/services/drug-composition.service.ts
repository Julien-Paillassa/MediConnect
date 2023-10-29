import { type FindOptionsWhere } from 'typeorm'
import AppDataSource from '../data-source'
import { type PaginationData } from 'mediconnect'
import { applyFiltersOnSelectQuery } from '../utils/query'
import { DrugComposition } from '../entity/DrugComposition'

export async function list (
  page: number = 0,
  size: number = 10,
  filters: FindOptionsWhere<DrugComposition>
): Promise<PaginationData<DrugComposition>> {
  const query = AppDataSource.manager.createQueryBuilder(DrugComposition, 'drug_composition')
  const queryWithFilters = applyFiltersOnSelectQuery(DrugComposition, query, filters)
  const [items, total] = await queryWithFilters.skip(size * page).take(size).getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugComposition> {
  return await AppDataSource.manager.findOneOrFail(DrugComposition, { where: { id } })
}
