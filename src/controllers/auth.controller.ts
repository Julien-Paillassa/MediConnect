import { type NextFunction, type Request as ExpressRequest, type Response as ExpressResponse } from 'express'
import * as jwt from 'jsonwebtoken'
import * as AuthService from '../services/auth.service'
import bcrypt from 'bcrypt'

function isValidPassword (password: any): boolean {
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/
  return regex.test(password)
}

export function signUp (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  const { name, email, password, address } = req.body

  if (!isValidPassword(password)) {
    res.status(400).send({ message: 'Password does not meet the requirements.' })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)

  AuthService.signUp({
    name,
    email,
    password: hashedPassword,
    address
  }).then((user) => {
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email
    }
    res.status(201).send(userResponse)
  }).catch((err) => {
    next(err)
  })
}

export function signIn (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  AuthService.signIn({ email: req.body.email, password: req.body.password })
    .then(() => {
      if (process.env.TOKEN_SECRET_KEY == null) {
        throw new Error('TOKEN_SECRET_KEY is not defined')
      }

      const token = jwt.sign({ id: req.body.id, name: req.body.name }, process.env.TOKEN_SECRET_KEY)
      res.json({
        success: true,
        token,
        name: req.body.name
      })
    }).catch((err) => {
      next(err)
    })
}
