import { type Request, type Response, type NextFunction } from 'express'
import AppDataSource from '../data-source'
import jwt from 'jsonwebtoken'

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: any
  }
}

export function authenticate (req: Request, res: Response, next: NextFunction): void {
  const authorizationHeader = req.headers.authorization
  const token = authorizationHeader?.split(' ')[1]

  if (token != null) {
    if (process.env.TOKEN_SECRET_KEY == null) {
      throw new Error('TOKEN_SECRET_KEY is not defined')
    }
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded: any) => {
      if (err != null) {
        res.status(401).send({ message: 'You are not authorized to perform this operation!' })
      } else {
        AppDataSource.manager.findOneByOrFail('User', { where: { id: decoded.id } })
          .then((user) => {
            if (user === null) {
              res.status(404).send({ message: 'Invalid token' })
            } else {
              req.currentUser = user
              next()
            }
          })
          .catch((error) => {
            next(error)
          })
      }
    })
  } else {
    res.status(403).send({ message: 'Missing token' })
  }
}
