import AppDataSource from '../data-source'
import { Plan } from '../entity/Plan'

export async function get (id: string): Promise<Plan> {
  return await AppDataSource.manager.findOneOrFail(Plan, { where: { id } })
}
