import { type DeepPartial } from 'typeorm'
import { User } from '../entity/User'
import AppDataSource from '../data-source'

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
