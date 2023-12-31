import { type NextFunction, type Request as ExpressRequest, type Response as ExpressResponse } from 'express'
import * as UserService from '../services/user.service'
import bcrypt from 'bcrypt'

export function update (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  const password = req.body.password
  const hashedPassword = bcrypt.hashSync(password, 10)
  UserService.update({ name: req.body.name, email: req.body.email, password: hashedPassword }).then((user) => {
    res.status(200).send(user)
  }).catch((err) => {
    next(err)
  })
}

export function remove (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  UserService.remove({ id: req.body.id }).then(() => {
    res.status(204).send()
  }).catch((err) => {
    next(err)
  })
}
