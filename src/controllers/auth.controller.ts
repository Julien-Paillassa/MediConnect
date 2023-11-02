import { type NextFunction, type Request as ExpressRequest, type Response as ExpressResponse } from 'express'
import * as jwt from 'jsonwebtoken'
import * as AuthService from '../services/auth.service'
import bcrypt from 'bcrypt'

export function signUp (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  const password = req.body.password
  const hashedPassword = bcrypt.hashSync(password, 10)

  AuthService.signUp({ name: req.body.name, email: req.body.email, password: hashedPassword, subscription: req.body.subscriptionId }).then((user) => {
    res.status(201).send(user)
  }
  ).catch((err) => {
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
