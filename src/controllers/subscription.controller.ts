import { type NextFunction, type Request, type Response } from 'express'
import * as SubscriptionService from '../services/subscription.service'

export function create (req: Request, res: Response, next: NextFunction): void {
  SubscriptionService.subscribe(req.currentUser, req.body.planId)
    .then((subscriptionIntent) => res.status(200).send(subscriptionIntent))
    .catch(error => { next(error) })
}
