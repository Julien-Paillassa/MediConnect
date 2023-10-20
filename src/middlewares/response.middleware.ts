import { type Request, type NextFunction, type Response } from 'express'

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
  res.status(status).send({ statusCode: status, message: err.message, error: err.name })
}

export function invalidRouteResponse (_req: Request, res: Response): void {
  res.status(404).send({ statusCode: 404, message: 'Invalid route' })
}
