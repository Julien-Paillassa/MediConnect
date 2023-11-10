import { type NextFunction, type Request, type Response } from 'express'
import * as UserSubscriptionService from '../services/user-subscription.service'

export function create (req: Request, res: Response, next: NextFunction): void {
  UserSubscriptionService.subscribe(req.currentUser, req.body.subscriptionId)
    .then((subscriptionIntent) => res.status(200).send(subscriptionIntent))
    .catch(error => { next(error) })
}

export function webhook (req: Request, res: Response, next: NextFunction): void {
  UserSubscriptionService.webhook(JSON.stringify(req.body), req.headers['stripe-signature'] as string)
    .then(() => res.status(204))
    .catch(error => { next(error) })
}
