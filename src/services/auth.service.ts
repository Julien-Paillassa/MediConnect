import { type DeepPartial } from 'typeorm'
import { User } from '../entity/User'
import AppDataSource from '../data-source'
import * as bcrypt from 'bcrypt'

class CustomError extends Error {
  status: number
  constructor (message: string, status: number) {
    super(message)
    this.status = status
    this.name = this.constructor.name
  }
}

export async function signUp (data: DeepPartial<User>): Promise<User> {
  const user = AppDataSource.manager.create(User, data)
  const saveUser = await AppDataSource.manager.save(user)
  if (saveUser == null) throw new CustomError('User not found', 404)

  return saveUser as User
}

export async function signIn (data: DeepPartial<User>): Promise<User> {
  const user = await AppDataSource.manager.findOneOrFail(User, {
    where: { email: data.email }
  })

  if (user == null) throw new Error('User not found')

  if (data.email !== undefined && data.password !== undefined) {
    const isPasswordValid = bcrypt.compare(user.password, data.password)

    if (isPasswordValid == null) throw new CustomError('Invalid password.', 401)
  } else {
    throw new CustomError('Missing email or password.', 400)
  }

  return user
}
