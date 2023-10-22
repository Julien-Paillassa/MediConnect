import { type NextFunction, type Request, type Response } from 'express'
import { type FindOptionsWhere } from 'typeorm'
import { type Generic } from '../entity/Generic'
import * as GenericKeyService from '../services/generic.service'

export function list (req: Request, res: Response, next: NextFunction): void {
  const filters: FindOptionsWhere<Generic> = {}
  if (req.query?.name != null) filters.name = req.query.name as string

  GenericKeyService.list(
    req.query?.page != null ? parseInt(req.query.page as string) : undefined,
    req.query?.size != null ? parseInt(req.query.size as string) : undefined,
    filters
  ).then((data) => {
    res.status(200).send(data)
  }).catch((err) => {
    next(err)
  })
}

export function get (req: Request, res: Response, next: NextFunction): void {
  GenericKeyService.get(parseInt(req.params.id)).then((data) => {
    res.status(200).send(data)
  }).catch((err) => {
    next(err)
  })
}
