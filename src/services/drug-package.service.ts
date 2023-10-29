import { type FindOptionsWhere } from 'typeorm'
import AppDataSource from '../data-source'
import { type PaginationData } from 'mediconnect'
import { applyFiltersOnSelectQuery } from '../utils/query'
import { DrugPackage } from '../entity/DrugPackage'

export async function list (
  page: number = 0,
  size: number = 10,
  filters: FindOptionsWhere<DrugPackage>
): Promise<PaginationData<DrugPackage>> {
  const query = AppDataSource.manager.createQueryBuilder(DrugPackage, 'drug_package')
  const queryWithFilters = applyFiltersOnSelectQuery(DrugPackage, query, filters)
  const [items, total] = await queryWithFilters.skip(size * page).take(size).getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugPackage> {
  return await AppDataSource.manager.findOneOrFail(DrugPackage, { where: { id } })
}
