import { type NextFunction, type Request as ExpressRequest, type Response as ExpressResponse } from 'express'
import * as ApiKeyService from '../services/api-key.service'
import { type order } from 'mediconnect'

export function list (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  const { page, size, sort, order, ...filters } = req.query
  ApiKeyService.list(
    page != null ? parseInt(page as string) : undefined,
    size != null ? parseInt(size as string) : undefined,
    sort != null ? sort as string : undefined,
    order != null ? order as order : undefined,
    { ...filters, owner: req.currentUser.id }
  )
    .then((data) => res.status(200).send(data))
    .catch((err) => { next(err) })
}

export function create (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  ApiKeyService.create({ ...req.body, owner: { id: req.currentUser.id } }).then((apiKey) => {
    res.status(201).send(apiKey)
  }).catch((err) => {
    next(err)
  })
}

export function update (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  ApiKeyService.update(parseInt(req.params.id), req.currentUser, { name: req.body.name }).then((apiKey) => {
    res.status(200).send(apiKey)
  }).catch((err) => {
    next(err)
  })
}

export function remove (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void {
  ApiKeyService.remove(parseInt(req.params.id), req.currentUser).then(() => {
    res.status(204).send()
  }).catch((err) => {
    next(err)
  })
}
