import { type NextFunction, type Request, type Response } from 'express'
import * as WebhookService from '../services/webhook.service'

export function stripe (req: Request, res: Response, next: NextFunction): void {
  WebhookService.stripe(req.body, req.headers['stripe-signature'])
    .then(() => res.status(204))
    .catch(error => { next(error) })
}
