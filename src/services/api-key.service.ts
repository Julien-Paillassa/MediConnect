import { type PaginationData } from 'mediconnect'
import { type DeepPartial } from 'typeorm'
import AppDataSource from '../data-source'
import { ApiKey } from '../entity/ApiKey'
import { applyFiltersOnSelectQuery } from '../utils/query'

export async function list (
  page: number = 0,
  size: number = 10,
  filters: Record<string, any>
): Promise<PaginationData<ApiKey>> {
  const query = AppDataSource.manager.createQueryBuilder(ApiKey, 'api_key')
  const queryWithFilters = applyFiltersOnSelectQuery(ApiKey, query, filters)
  const [items, total] = await queryWithFilters.skip(size * page).take(size).getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function create (data: DeepPartial<ApiKey>): Promise<ApiKey> {
  const apiKey = AppDataSource.manager.create(ApiKey, data)
  return (await AppDataSource.manager.save(apiKey)) as ApiKey
}

export async function update (apiKeyId: number, userId: number, data: DeepPartial<ApiKey>): Promise<ApiKey> {
  const apiKey = await AppDataSource.manager.findOneOrFail(ApiKey, {
    where: { id: apiKeyId, owner: { id: userId } }
  })
  AppDataSource.manager.merge(ApiKey, apiKey, data)
  return await AppDataSource.manager.save(apiKey)
}

export async function remove (apiKeyId: number, userId: number): Promise<void> {
  const apiKey = await AppDataSource.manager.findOneOrFail(ApiKey, {
    where: { id: apiKeyId, owner: { id: userId } }
  })
  await AppDataSource.manager.remove(apiKey)
}
