import { type order, type PaginationData } from 'mediconnect'
import moment from 'moment'
import { type DeepPartial, type DeleteResult, type ObjectId, type ObjectLiteral } from 'typeorm'
import AppDataSource from '../data-source'
import { DrugSpecification, type MarketingAuthorizationStatus, type OriginalDatabaseStatus } from '../entity/DrugSpecification'
import { applyFiltersOnSelectQuery } from '../utils/query'

export async function list (
  page: number = 0,
  size: number = 10,
  sort: string = 'id',
  order: order = 'ASC',
  filters: ObjectLiteral
): Promise<PaginationData<DrugSpecification>> {
  const aliasName = AppDataSource.manager.connection.getMetadata(DrugSpecification).tableName
  const query = AppDataSource.manager.createQueryBuilder(DrugSpecification, aliasName)
  const queryWithFilters = applyFiltersOnSelectQuery(DrugSpecification, query, filters)
  const [items, total] = await queryWithFilters
    .orderBy(`${aliasName}.${sort}`, order, 'NULLS LAST')
    .skip(size * page)
    .take(size)
    .getManyAndCount()
  return { total, page, count: items.length, items }
}

export async function get (id: number): Promise<DrugSpecification> {
  return await AppDataSource.manager.findOneOrFail(DrugSpecification, { where: { id } })
}

export async function save (data: ObjectLiteral): Promise<DrugSpecification> {
  if (data.id == null) throw new Error('id must be provided')

  let drugSpecification: DrugSpecification
  try {
    drugSpecification = await get(data.id)
  } catch (e) {
    drugSpecification = new DrugSpecification()
    drugSpecification.id = data.id
  }

  drugSpecification.name = data.name
  drugSpecification.form = data.form
  drugSpecification.administrations = data.administrations
  if (data.marketingAuthorizationStatus != null) drugSpecification.marketingAuthorizationStatus = data.marketingAuthorizationStatus as MarketingAuthorizationStatus
  drugSpecification.marketingAuthorizationProcedure = data.marketingAuthorizationProcedure
  drugSpecification.isBeingMarketed = data.isBeingMarketed === 'Commercialisée'
  drugSpecification.marketingAuthorizationDate = moment.utc(data.marketingAuthorizationDate, 'DD/MM/YYYY').toDate()
  if (data.ogDbStatus != null) drugSpecification.ogDbStatus = data.ogDbStatus as OriginalDatabaseStatus
  drugSpecification.europeanAuthorizationNumber = data.europeanAuthorizationNumber
  drugSpecification.holders = data.holders
  drugSpecification.reinforcedMonitoring = data.reinforcedMonitoring
  drugSpecification.prescriptionRestriction = data.prescriptionRestriction
  return await AppDataSource.manager.save(drugSpecification)
}

export async function update (id: number, data: DeepPartial<DrugSpecification>): Promise<DrugSpecification> {
  const drugSpecification = AppDataSource.manager.merge(DrugSpecification, await get(id), data)
  return await AppDataSource.manager.save(drugSpecification)
}

export async function deleteBy (criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[]): Promise<DeleteResult> {
  return await AppDataSource.manager.delete(DrugSpecification, criteria)
}
