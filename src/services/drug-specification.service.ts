import { type FindOptionsWhere } from 'typeorm'
import AppDataSource from '../data-source'
import { type PaginationData } from 'mediconnect'
import { DrugSpecification } from '../entity/DrugSpecification'
import { applyFiltersOnSelectQuery } from '../utils/query'

export async function list (
  page: number = 0,
  size: number = 10,
  filters: FindOptionsWhere<DrugSpecification>
): Promise<PaginationData<DrugSpecification>> {
  const query = AppDataSource.manager.createQueryBuilder(DrugSpecification, 'drug_specification')
  const queryWithFilters = applyFiltersOnSelectQuery(DrugSpecification, query, filters)
  const [items, total] = await queryWithFilters.skip(size * page).take(size).getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugSpecification> {
  return await AppDataSource.manager.findOneOrFail(DrugSpecification, { where: { id } })
}
