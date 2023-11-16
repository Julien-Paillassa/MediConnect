import express, { type Request, type NextFunction, type Response } from 'express'

export function handleErrorResponse (err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err)
  let status = 500
  if (err.name === 'EntityNotFoundError') {
    status = 404
  } else if (err.name === 'QueryFailedError' || err.name === 'ValidationError') {
    status = 400
  } else if (err.status != null) {
    status = err.status
  }
  res.status(status).send({ message: err.message })
}

export function invalidRouteResponse (_req: Request, res: Response): void {
  res.status(404).send({ message: 'Invalid route' })
}

export function bodyParse (req: Request, res: Response, next: NextFunction): void {
  if (req.originalUrl === '/webhooks/stripe') {
    next()
  } else {
    express.json()(req, res, next)
  }
}
