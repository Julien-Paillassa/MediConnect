import { type order, type PaginationData } from 'mediconnect'
import { type DeleteResult, type ObjectId, type ObjectLiteral } from 'typeorm'
import AppDataSource from '../data-source'
import { DrugGeneric, type GenericType } from '../entity/DrugGeneric'
import { applyFiltersOnSelectQuery } from '../utils/query'
import * as DrugSpecificationService from './drug-specification.service'
import * as GenericService from './generic.service'

export async function list (
  page: number = 0,
  size: number = 10,
  sort: string = 'id',
  order: order = 'ASC',
  filters: ObjectLiteral
): Promise<PaginationData<DrugGeneric>> {
  const aliasName = AppDataSource.manager.connection.getMetadata(DrugGeneric).tableName
  const query = AppDataSource.manager.createQueryBuilder(DrugGeneric, aliasName)
  const queryWithFilters = applyFiltersOnSelectQuery(DrugGeneric, query, filters)
  const [items, total] = await queryWithFilters
    .orderBy(`${aliasName}.${sort}`, order, 'NULLS LAST')
    .skip(size * page)
    .take(size)
    .getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugGeneric> {
  return await AppDataSource.manager.findOneOrFail(DrugGeneric, { where: { id } })
}

export async function save (data: ObjectLiteral): Promise<DrugGeneric> {
  const drugGeneric = new DrugGeneric()

  if (data.drug !== undefined) {
    drugGeneric.drug = data.drug
  } else if (data.drugId !== undefined) {
    drugGeneric.drug = await DrugSpecificationService.get(data.drugId)
  } else {
    throw new Error('Drug or drugId must be provided')
  }

  if (data.generic !== undefined) {
    drugGeneric.generic = data.generic
  } else if (data.genericId !== undefined) {
    drugGeneric.generic = await GenericService.get(data.genericId)
  } else {
    throw new Error('Generic or genericId must be provided')
  }

  if (data.type != null) drugGeneric.type = data.type as GenericType
  drugGeneric.rank = data.rank

  return await AppDataSource.manager.save(drugGeneric)
}

export async function deleteBy (criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[]): Promise<DeleteResult> {
  return await AppDataSource.manager.delete(DrugGeneric, criteria)
}
