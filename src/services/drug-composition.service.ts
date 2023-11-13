import { type order, type PaginationData } from 'mediconnect'
import { type DeleteResult, type ObjectId, type ObjectLiteral } from 'typeorm'
import AppDataSource from '../data-source'
import { DrugComposition, type SubstanceNatureType } from '../entity/DrugComposition'
import { applyFiltersOnSelectQuery } from '../utils/query'
import * as DrugSpecificationService from './drug-specification.service'

export async function list (
  page: number = 0,
  size: number = 10,
  sort: string = 'id',
  order: order = 'ASC',
  filters: ObjectLiteral
): Promise<PaginationData<DrugComposition>> {
  const aliasName = AppDataSource.manager.connection.getMetadata(DrugComposition).tableName
  const query = AppDataSource.manager.createQueryBuilder(DrugComposition, aliasName)
  const queryWithFilters = applyFiltersOnSelectQuery(DrugComposition, query, filters)
  const [items, total] = await queryWithFilters
    .orderBy(`${aliasName}.${sort}`, order, 'NULLS LAST')
    .skip(size * page)
    .take(size)
    .getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugComposition> {
  return await AppDataSource.manager.findOneOrFail(DrugComposition, { where: { id } })
}

export async function create (data: ObjectLiteral): Promise<DrugComposition> {
  const drugComposition = new DrugComposition()

  if (data.drug != null) {
    drugComposition.drug = data.drug
  } else if (data.drugId != null) {
    drugComposition.drug = await DrugSpecificationService.get(data.drugId)
  } else {
    throw new Error('Drug or drugId must be provided')
  }

  drugComposition.name = data.name
  drugComposition.substanceCode = data.substanceCode
  drugComposition.substanceName = data.substanceName
  drugComposition.substanceDosage = data.substanceDosage
  drugComposition.substanceDosageReference = data.substanceDosageReference
  if (data.substanceNature != null) drugComposition.substanceNature = data.substanceNature as SubstanceNatureType
  drugComposition.substancesLinkNumber = data.substancesLinkNumber

  return await AppDataSource.manager.save(drugComposition)
}

export async function update (id: number, data: ObjectLiteral): Promise<DrugComposition> {
  const drugComposition = AppDataSource.manager.merge(DrugComposition, await get(id), data)
  return await AppDataSource.manager.save(drugComposition)
}

export async function deleteBy (criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[]): Promise<DeleteResult> {
  return await AppDataSource.manager.delete(DrugComposition, criteria)
}
