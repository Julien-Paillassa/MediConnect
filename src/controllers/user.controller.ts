import { type NextFunction, type Request as ExpressRequest, type Response as ExpressResponse } from 'express'
import * as UserServices from '../services/user.service'
import bcrypt from 'bcrypt'

export function create (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  const password = req.body.password
  const hashedPassword = bcrypt.hashSync(password, 10)

  UserServices.create({ name: req.body.name, email: req.body.email, password: hashedPassword, subscription: req.body.subscriptionId }).then((user) => {
    res.status(201).send(user)
  }
  ).catch((err) => {
    next(err)
  })
}

export function update (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  const password = req.body.password
  const hashedPassword = bcrypt.hashSync(password, 10)
  UserServices.update(parseInt(req.params.id), { name: req.body.name, email: req.body.email, password: hashedPassword }).then((user) => {
    res.status(200).send(user)
  }).catch((err) => {
    next(err)
  })
}

export function remove (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  UserServices.remove(parseInt(req.params.id)).then(() => {
    res.status(204).send()
  }).catch((err) => {
    next(err)
  })
}
