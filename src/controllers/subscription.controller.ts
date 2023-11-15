import { type NextFunction, type Request, type Response } from 'express'
import * as SubscriptionService from '../services/subscription.service'

export function create (req: Request, res: Response, next: NextFunction): void {
  SubscriptionService.subscribe(req.currentUser, req.body.planId)
    .then((subscriptionIntent) => res.status(200).send(subscriptionIntent))
    .catch(error => { next(error) })
}

export function cancel (req: Request, res: Response, next: NextFunction): void {
  SubscriptionService.cancel(req.currentUser)
    .then(() => res.status(200).send({}))
    .catch(error => { next(error) })
}

export function webhook (req: Request, res: Response, next: NextFunction): void {
  SubscriptionService.webhook(JSON.stringify(req.body), req.headers['stripe-signature'] as string)
    .then(() => res.status(204))
    .catch(error => { next(error) })
}
