import { type NextFunction, type Request as ExpressRequest, type Response as ExpressResponse } from 'express'
import { type ApiKey } from '../entity/ApiKey'
import { type FindOptionsWhere, ILike } from 'typeorm'
import * as ApiKeyService from '../services/api-key.service'

// TODO : Replace 1 by the user id from the JWT token

export function list (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  const filters: FindOptionsWhere<ApiKey> = { owner: { id: 1 } }
  if (req.query?.name != null) filters.name = ILike(`%${req.query.name as string}%`)

  ApiKeyService.list(
    req.query?.page != null ? parseInt(req.query.page as string) : undefined,
    req.query?.size != null ? parseInt(req.query.size as string) : undefined,
    filters
  ).then((data) => {
    res.status(200).send(data)
  }).catch((err) => {
    next(err)
  })
}

export function create (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  ApiKeyService.create({ owner: { id: 1 }, name: req.body.name }).then((apiKey) => {
    res.status(201).send(apiKey)
  }
  ).catch((err) => {
    next(err)
  })
}

export function update (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  ApiKeyService.update(parseInt(req.params.id), 1, { name: req.body.name }).then((apiKey) => {
    res.status(200).send(apiKey)
  }).catch((err) => {
    next(err)
  })
}

export function remove (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  ApiKeyService.remove(parseInt(req.params.id), 1).then(() => {
    res.status(204).send()
  }).catch((err) => {
    next(err)
  })
}
