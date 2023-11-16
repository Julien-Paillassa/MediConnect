import { type NextFunction, type Request, type Response } from 'express'
import AppDataSource from '../data-source'
import { ApiKey } from '../entity/ApiKey'
import { rateLimiters } from '../utils/rateLimiter'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PWD
  }
})

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
    .leftJoinAndSelect('owner.subscription', 'subscription')
    .leftJoinAndSelect('subscription.plan', 'plan')
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
          switch (rateLimiterRes.remainingPoints) {
            case ((rateLimiter.points / 100) * 50):
              transporter.sendMail({
                from: process.env.SMTP_AUTH_USER,
                to: 'julien.paillassa@gmail.com',
                subject: 'WARNING !',
                html: `Be carefull ! You only have ${(rateLimiter.points / 100) * 50} requests left before reaching your subscription limit.`
              }, (error, info) => {
                if (error != null) {
                  console.error('Erreur lors de l\'envoi de l\'e-mail:', error)
                } else {
                  console.log('E-mail envoyé:', info.response)
                }
              })
              next()
              break
            case ((rateLimiter.points / 100) * 10):
              transporter.sendMail({
                from: process.env.SMTP_AUTH_USER,
                to: 'julien.paillassa@gmail.com',
                subject: 'WARNING !',
                html: `Be carefull ! You only have ${(rateLimiter.points / 100) * 10} requests left before reaching your subscription limit.`
              }, (error, info) => {
                if (error != null) {
                  console.error('Erreur lors de l\'envoi de l\'e-mail:', error)
                } else {
                  console.log('E-mail envoyé:', info.response)
                }
              })
              next()
              break
            default:
              next()
          }
        })
        .catch((rateLimiterRes) => {
          transporter.sendMail({
            from: process.env.SMTP_AUTH_USER,
            to: 'julien.paillassa@gmail.com',
            subject: 'WARNING !',
            text: 'You have reached the request limit available with your subscription',
            html: 'You have reached the request limit available with your subscription'
          }, (error, info) => {
            if (error != null) {
              console.error('Erreur lors de l\'envoi de l\'e-mail:', error)
            } else {
              console.log('E-mail envoyé:', info.response)
            }
          })
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
