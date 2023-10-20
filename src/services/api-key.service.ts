import { type DeepPartial, type FindOptionsWhere, type ObjectLiteral } from 'typeorm'
import AppDataSource from '../data-source'
import { ApiKey } from '../entity/ApiKey'

interface PaginationData<Entity extends ObjectLiteral> {
  total: number
  page: number
  count: number
  items: Entity[]
}

export async function list (page: number = 0, size: number = 10, filters: FindOptionsWhere<ApiKey>): Promise<PaginationData<ApiKey>> {
  const query = AppDataSource.manager.createQueryBuilder(ApiKey, 'apiKey').where(filters)
  const total = await query.getCount()
  const [items, count] = await query.skip(size * page).take(size).getManyAndCount()
  return { total, page, count, items }
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
