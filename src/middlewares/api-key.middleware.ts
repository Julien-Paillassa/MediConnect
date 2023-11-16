import { type NextFunction, type Request, type Response } from 'express'
import { now } from 'moment'
import AppDataSource from '../data-source'
import { ApiKey } from '../entity/ApiKey'

export function onlyValidApiKey (req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.cookies['X-API-KEY']
  if (typeof apiKey !== 'string' || apiKey === '') {
    res.status(401)
      .set('WWW-Authenticate', 'Cookie realm="X-API-KEY"')
      .send({ message: 'Missing API key' })
    return
  }
  AppDataSource.manager.findOneOrFail(ApiKey, { where: { key: apiKey } })
    .then((apiKey) => {
      if (apiKey.expiresAt.getTime() < now()) {
        res.status(401).send({ message: 'Expired API key' })
      }
      next()
    })
    .catch((err) => {
      if (err.name === 'EntityNotFoundError') {
        res.status(401).send({ message: 'Invalid API key' })
      }
      next(err)
    })
}
