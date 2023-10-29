import { type ObjectLiteral, type SelectQueryBuilder, type EntityTarget, Brackets, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import AppDataSource from '../data-source'
import moment from 'moment'

export function applyFiltersOnSelectQuery<Entity extends ObjectLiteral> (
  entity: EntityTarget<Entity>,
  query: SelectQueryBuilder<Entity>,
  filters: Record<string, any>,
  excludeColumns: string[] = [],
  relationship?: string
): SelectQueryBuilder<Entity> {
  const metadata = AppDataSource.manager.connection.getMetadata(entity)

  Object.entries(filters).forEach(([key, value]) => {
    // Remove min/max suffix
    const field = key.replace(/(Min|Max)$/, '')

    const columnPath = (relationship != null) ? `${relationship}.${field}` : field
    if (excludeColumns.includes(columnPath)) return

    const column = metadata.findColumnWithPropertyPath(columnPath)
    if (column === undefined) return
    const type = (column.type as any).name ?? column.type

    switch (type) {
      case 'String':
        if (value === '') break
        query.andWhere(
            `unaccent(${metadata.tableName}.${columnPath}) ILIKE unaccent(:${field})`,
            { [columnPath]: `%${value}%` }
        )
        break
      case 'enum':
        // eslint-disable-next-line no-case-declarations
        const arrValue = Array.isArray(value) ? value : [value]
        if (arrValue.includes('')) break

        if (arrValue.includes('null')) {
          const filteredValue = arrValue.filter((v: string) => v !== 'null')
          query.andWhere(new Brackets((qb) => {
            qb.where({ [columnPath]: null })
            if (filteredValue.length > 0) {
              qb.orWhere({ [columnPath]: In(filteredValue) })
            }
          }))
        } else {
          query.andWhere({ [columnPath]: In(arrValue) })
        }
        break
      case 'Number':
        if (key.endsWith('Min')) {
          query.andWhere({ [columnPath]: MoreThanOrEqual(Number(value)) })
        } else if (key.endsWith('Max')) {
          query.andWhere({ [columnPath]: LessThanOrEqual(Number(value)) })
        } else {
          query.andWhere({ [columnPath]: Number(value) })
        }
        break
      case 'Boolean':
        query.andWhere({ [columnPath]: value === 'true' || value === true || value === '1' || value === 1 })
        break
      case 'timestamptz':
        if (value === '') break
        if (key.startsWith('Min')) {
          query.andWhere({ [columnPath]: MoreThanOrEqual(moment(value).toDate()) })
        } else if (key.startsWith('Max')) {
          query.andWhere({ [columnPath]: LessThanOrEqual(moment(value).toDate()) })
        } else {
          query.andWhere({ [columnPath]: moment(value).toDate() })
        }
        break
      case 'simple-array':
        if (!Array.isArray(value)) {
          value = [value]
        }
        query.andWhere(
          `unaccent(${metadata.tableName}.${columnPath}) ILIKE ANY(:${field})`,
          // TODO: string utils ?
          // normalize and replace is used to remove accents
          { [field]: value.map((v: string) => `%${v.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}%`) }
        )
        break
      default:
        console.log(`Unknown type ${type} for column ${columnPath}. Filter to apply: `, value)
        break
    }
  })
  return query
}
