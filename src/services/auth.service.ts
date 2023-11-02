import { type DeepPartial } from 'typeorm'
import { User } from '../entity/User'
import AppDataSource from '../data-source'
import * as bcrypt from 'bcrypt'

export async function login (data: DeepPartial<User>): Promise<User> {
  const user = await AppDataSource.manager.findOneOrFail(User, {
    where: { email: data.email }
  })

  if (user == null) throw new Error('User not found')

  if (data.email !== undefined && data.password !== undefined) {
    const isPasswordValid = bcrypt.compare(user.password, data.password)

    if (isPasswordValid == null) throw new Error('Authentication failed. Invalid password.')
  } else {
    throw new Error('Authentication failed. Missing email or password.')
  }

  return user
}
