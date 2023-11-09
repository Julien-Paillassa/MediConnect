import { type NextFunction, type Request, type Response } from 'express'
import { now } from 'moment'
import AppDataSource from '../data-source'
import { ApiKey } from '../entity/ApiKey'
import { limiter, limiterBasic, limiterEnterprise, limiterPro } from '../utils/rateLimiter'
import { User } from '../entity/User'

export function onlyValidApiKey (req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.cookies['X-API-KEY']
  if (typeof apiKey !== 'string' || apiKey === '') {
    res.status(401)
      .set('WWW-Authenticate', 'Cookie realm="X-API-KEY"')
      .send({ message: 'Missing API key' })
    return
  }
  AppDataSource.manager.findOneOrFail(ApiKey, { where: { key: apiKey }, relations: ['owner'] })
    .then(async (apiKey) => {
      if (apiKey.expiresAt.getTime() < now()) {
        res.status(401).send({ message: 'Expired API key' })
      }

      const owner = await AppDataSource.manager.findOneOrFail(User, { where: { email: apiKey.owner.email }, relations: ['subscription'] })

      switch (owner.subscription?.plan.name) {
        case 'Free':
          limiterBasic(req, res, () => { next() })
          break
        case 'Pro':
          limiterPro(req, res, () => { next() })
          break
        case 'Enterprise':
          limiterEnterprise(req, res, () => { next() })
          break
        default:
          limiter(req, res, () => { next() })
      }
    })
    .catch((err) => {
      if (err.name === 'EntityNotFoundError') {
        res.status(401).send({ message: 'Invalid API key' })
      }
      next(err)
    })
}
