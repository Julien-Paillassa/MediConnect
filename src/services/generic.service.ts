import { type FindOptionsWhere } from 'typeorm'
import AppDataSource from '../data-source'
import { type PaginationData } from 'mediconnect'
import { Generic } from '../entity/Generic'

export async function list (
  page: number = 0,
  size: number = 10,
  filters: FindOptionsWhere<Generic>
): Promise<PaginationData<Generic>> {
  const { name, ...otherFilters } = filters

  const query = AppDataSource.manager
    .createQueryBuilder(Generic, 'generic')
    .where(otherFilters)

  if (name !== null && name !== undefined) {
    query.andWhere(
      'unaccent(generic.name) ILIKE unaccent(:name)',
      { name: `%${name as string}%` }
    )
  }

  const [items, total] = await query.skip(size * page).take(size).getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<Generic> {
  return await AppDataSource.manager.findOneOrFail(Generic, { where: { id } })
}
