import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import type Stripe from 'stripe'
import { type DeepPartial } from 'typeorm'
import { createCustomer } from '../clients/stripe.client'
import AppDataSource from '../data-source'
import { User } from '../entity/User'
import { CustomError } from '../errors/custom-error'

function isValidPassword (password: any): boolean {
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/
  return regex.test(password)
}

export async function signUp (data: DeepPartial<User> & { address: Stripe.AddressParam }): Promise<User> {
  const existingUser = await AppDataSource.manager.findOne(User, { where: { email: data.email } })

  if (existingUser != null) {
    throw new CustomError('User already exists', 409)
  }

  if (!isValidPassword(data.password)) {
    throw new CustomError('Password does not meet the requirements', 400)
  }

  const customer = await createCustomer(data.email as string, data.name as string, data.address)
  data.id = customer.id
  const user = AppDataSource.manager.create(User, data)
  const saveUser = await AppDataSource.manager.save(user)

  return saveUser
}

export async function signIn (data: DeepPartial<User>): Promise<string> {
  const user = await AppDataSource.manager.findOneOrFail(User, {
    where: { email: data.email }
  })

  if (data.email !== undefined && data.password !== undefined) {
    const isPasswordValid = bcrypt.compare(user.password, data.password)

    if (isPasswordValid == null) throw new CustomError('Invalid password.', 401)
  } else {
    throw new CustomError('Missing email or password.', 400)
  }

  if (process.env.TOKEN_SECRET_KEY == null) {
    throw new Error('TOKEN_SECRET_KEY is not defined')
  }

  const token = jwt.sign({ id: user.id, name: user.name }, process.env.TOKEN_SECRET_KEY)

  return token
}
