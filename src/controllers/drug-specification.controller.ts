import { type NextFunction, type Request, type Response } from 'express'
import * as DrugSpecificationService from '../services/drug-specification.service'

export function list (req: Request, res: Response, next: NextFunction): void {
  DrugSpecificationService.list(
    req.query?.page != null ? parseInt(req.query.page as string) : undefined,
    req.query?.size != null ? parseInt(req.query.size as string) : undefined,
    req.query
  ).then((data) => {
    res.status(200).send(data)
  }).catch((err) => {
    next(err)
  })
}

export function get (req: Request, res: Response, next: NextFunction): void {
  DrugSpecificationService.get(parseInt(req.params.id)).then((data) => {
    res.status(200).send(data)
  }).catch((err) => {
    next(err)
  })
}
