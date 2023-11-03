import { type DeepPartial } from 'typeorm'
import { User } from '../entity/User'
import AppDataSource from '../data-source'
import * as bcrypt from 'bcrypt'
import { CustomError } from '../errors/custom-error'

export async function signUp (data: DeepPartial<User>): Promise<User> {
  const existingUser = await AppDataSource.manager.findOne(User, { where: { email: data.email } })

  if (existingUser != null) {
    throw new CustomError('User already exists', 409)
  }

  const user = AppDataSource.manager.create(User, data)
  const saveUser = await AppDataSource.manager.save(user)

  return saveUser as User
}

export async function signIn (data: DeepPartial<User>): Promise<User> {
  const user = await AppDataSource.manager.findOneOrFail(User, {
    where: { email: data.email }
  })

  if (data.email !== undefined && data.password !== undefined) {
    const isPasswordValid = bcrypt.compare(user.password, data.password)

    if (isPasswordValid == null) throw new Error('Authentication failed. Invalid password.')
  } else {
    throw new Error('Authentication failed. Missing email or password.')
  }

  return user
}
