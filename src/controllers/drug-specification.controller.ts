import { type NextFunction, type Request, type Response } from 'express'
import * as DrugSpecificationService from '../services/drug-specification.service'
import { type order } from 'mediconnect'

export function list (req: Request, res: Response, next: NextFunction): void {
  const { page, size, sort, order, ...filters } = req.query
  DrugSpecificationService.list(
    page != null ? parseInt(page as string) : undefined,
    size != null ? parseInt(size as string) : undefined,
    sort != null ? sort as string : undefined,
    order != null ? order as order : undefined,
    filters
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
