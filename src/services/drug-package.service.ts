import { type order, type PaginationData } from 'mediconnect'
import moment from 'moment'
import { type DeleteResult, type ObjectId, type ObjectLiteral } from 'typeorm'
import AppDataSource from '../data-source'
import { DrugPackage, type MarketingAuthorizationDeclarationStatus, type PackageStatus } from '../entity/DrugPackage'
import { applyFiltersOnSelectQuery } from '../utils/query'
import * as DrugSpecificationService from './drug-specification.service'

export async function list (
  page: number = 0,
  size: number = 10,
  sort: string = 'id',
  order: order = 'ASC',
  filters: ObjectLiteral
): Promise<PaginationData<DrugPackage>> {
  const aliasName = AppDataSource.manager.connection.getMetadata(DrugPackage).tableName
  const query = AppDataSource.manager.createQueryBuilder(DrugPackage, aliasName)
  const queryWithFilters = applyFiltersOnSelectQuery(DrugPackage, query, filters)
  const [items, total] = await queryWithFilters
    .orderBy(`${aliasName}.${sort}`, order, 'NULLS LAST')
    .skip(size * page)
    .take(size)
    .getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugPackage> {
  return await AppDataSource.manager.findOneOrFail(DrugPackage, { where: { id } })
}

export async function save (data: ObjectLiteral): Promise<DrugPackage> {
  if (data.id == null) throw new Error('id must be provided')

  let drugPackage: DrugPackage
  try {
    drugPackage = await get(data.id)
  } catch (e) {
    drugPackage = new DrugPackage()
    drugPackage.id = data.id
  }

  if (data.drug != null) {
    drugPackage.drug = data.drug
  } else if (data.drugId != null) {
    drugPackage.drug = await DrugSpecificationService.get(data.drugId)
  } else {
    throw new Error('Drug or drugId must be provided')
  }

  drugPackage.longId = data.longId
  drugPackage.name = data.name
  if (data.status != null) drugPackage.status = data.status as PackageStatus
  if (data.marketingAuthorizationStatus != null) drugPackage.marketingAuthorizationStatus = data.marketingAuthorizationStatus as MarketingAuthorizationDeclarationStatus
  drugPackage.marketingAuthorizationDeclarationDate = moment.utc(data.marketingAuthorizationDeclarationDate, 'DD/MM/YYYY').toDate()
  drugPackage.isAgreedToCommunities = data.isAgreedToCommunities
  drugPackage.refundRate = data.refundRate != null ? Number(data.refundRate.replace('%', '')) / 100 : undefined
  drugPackage.price = data.price
  drugPackage.refundInformation = data.refundingInformation
  return await AppDataSource.manager.save(drugPackage)
}

export async function deleteBy (criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[]): Promise<DeleteResult> {
  return await AppDataSource.manager.delete(DrugPackage, criteria)
}
