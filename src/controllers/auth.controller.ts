import { type NextFunction, type Request as ExpressRequest, type Response as ExpressResponse } from 'express'
import * as AuthService from '../services/auth.service'
import bcrypt from 'bcrypt'

export function signUp (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  const { name, email, password, address } = req.body

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
    .then((token) => {
      res.json({
        success: true,
        token
      })
    }).catch((err) => {
      next(err)
    })
}
