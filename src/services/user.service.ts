import { type DeepPartial } from 'typeorm'
import { User } from '../entity/User'
import AppDataSource from '../data-source'

export async function update (userId: number, data: DeepPartial<User>): Promise<User> {
  const user = await AppDataSource.manager.findOneOrFail(User, {
    where: { id: userId }
  })

  AppDataSource.manager.merge(User, user, data)
  return await AppDataSource.manager.save(user)
}

export async function remove (userId: number): Promise<void> {
  const user = await AppDataSource.manager.findOneOrFail(User, {
    where: { id: userId }
  })
  await AppDataSource.manager.remove(user)
}
