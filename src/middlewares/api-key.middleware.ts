import { type Request, type Response, type NextFunction } from 'express'
import AppDataSource from '../data-source'

export function onlyValidApiKey (req: Request, res: Response, next: NextFunction): void {
  if (typeof req.headers['X-API-KEY'] !== 'string' || req.headers['X-API-KEY'] === '') {
    res.status(401).send({ message: 'Missing API key' })
  }
  AppDataSource.manager.findOneOrFail('ApiKey', { where: { key: req.headers['X-API-KEY'] } })
    .then((apiKey) => {
      console.log('Valid API key', apiKey)
      next()
    }).catch((err) => {
      if (err.name === 'EntityNotFoundError') {
        res.status(401).send({ message: 'Invalid API key' })
      }
      next(err)
    })
}
