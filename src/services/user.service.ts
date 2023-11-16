import { type DeepPartial } from 'typeorm'
import AppDataSource from '../data-source'
import { User } from '../entity/User'

export async function update (data: DeepPartial<User>): Promise<User> {
  const user = await AppDataSource.manager.findOneOrFail(User, {
    where: { id: data.id }
  })

  AppDataSource.manager.merge(User, user, data)
  return await AppDataSource.manager.save(user)
}

export async function remove (data: DeepPartial<User>): Promise<void> {
  const user = await AppDataSource.manager.findOneOrFail(User, {
    where: { id: data.id }
  })
  await AppDataSource.manager.remove(user)
}

export async function get (id: string): Promise<User> {
  return await AppDataSource.manager.findOneOrFail(User, { where: { id } })
}
