import { type order, type PaginationData } from 'mediconnect'
import { type ObjectLiteral, type DeepPartial } from 'typeorm'
import AppDataSource from '../data-source'
import { ApiKey } from '../entity/ApiKey'
import { applyFiltersOnSelectQuery } from '../utils/query'
import { type User } from '../entity/User'

export async function list (
  page: number = 0,
  size: number = 10,
  sort: string = 'id',
  order: order = 'ASC',
  filters: ObjectLiteral
): Promise<PaginationData<ApiKey>> {
  const aliasName = AppDataSource.manager.connection.getMetadata(ApiKey).tableName
  const query = AppDataSource.manager.createQueryBuilder(ApiKey, aliasName)
  const queryWithFilters = applyFiltersOnSelectQuery(ApiKey, query, filters)
  const [items, total] = await queryWithFilters
    .orderBy(`${aliasName}.${sort}`, order, 'NULLS LAST')
    .skip(size * page)
    .take(size)
    .getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function create (data: DeepPartial<ApiKey>): Promise<ApiKey> {
  const apiKey = AppDataSource.manager.create(ApiKey, data)
  return (await AppDataSource.manager.save(apiKey)) as ApiKey
}

export async function update (apiKeyId: number, user: User, data: DeepPartial<ApiKey>): Promise<ApiKey> {
  const apiKey = await AppDataSource.manager.findOneOrFail(ApiKey, {
    where: { id: apiKeyId, owner: { id: user.id } }
  })
  AppDataSource.manager.merge(ApiKey, apiKey, data)
  return await AppDataSource.manager.save(apiKey)
}

export async function remove (apiKeyId: number, user: User): Promise<void> {
  const apiKey = await AppDataSource.manager.findOneOrFail(ApiKey, {
    where: { id: apiKeyId, owner: { id: user.id } }
  })
  await AppDataSource.manager.remove(apiKey)
}
