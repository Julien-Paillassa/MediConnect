import { type NextFunction, type Request, type Response } from 'express'
import AppDataSource from '../data-source'
import { ApiKey } from '../entity/ApiKey'
import { rateLimiters } from '../utils/rateLimiter'

export function onlyValidApiKey (req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.cookies['X-API-KEY']
  if (typeof apiKey !== 'string' || apiKey === '') {
    res.status(401)
      .set('WWW-Authenticate', 'Cookie realm="X-API-KEY"')
      .send({ message: 'Missing API key' })
    return
  }
  AppDataSource.manager
    .createQueryBuilder(ApiKey, 'apiKey')
    .innerJoinAndSelect('apiKey.owner', 'owner')
    .innerJoinAndSelect('owner.subscription', 'subscription')
    .where('apiKey.key = :apiKey', { apiKey })
    .andWhere('apiKey.expiresAt > :now', { now: new Date() })
    .getOneOrFail()
    .then(async (apiKey) => {
      const ownerId = apiKey.owner.id.toString()

      const rateLimiter = rateLimiters[apiKey.owner.subscription?.plan.name ?? 'default']

      let rateLimiterMsg: string

      if (apiKey.owner.subscription !== undefined) {
        rateLimiterMsg = `Your subcription is ${apiKey.owner.subscription.plan.name}. You can only make ${apiKey.owner.subscription.plan.ratePerMonth} requests per month !!`
      } else {
        rateLimiterMsg = 'You don\'t have subscripion. You have reached the maximum request by default. Please subscribe to one of our subscription.'
      }

      await rateLimiter.consume(ownerId, 1)
        .then((rateLimiterRes) => {
          console.log(rateLimiterRes)
          next()
        })
        .catch((rateLimiterRes) => {
          res.status(429).send({ message: rateLimiterMsg })
        })
    })
    .catch((err) => {
      if (err.name === 'EntityNotFoundError') {
        res.status(401).send({ message: 'Invalid API key' })
      }
      next(err)
    })
}
