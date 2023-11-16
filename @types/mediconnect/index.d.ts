import { type ObjectLiteral } from 'typeorm'
import { type User } from 'src/entity/User'
import type Stripe from 'stripe'

interface PaginationData<Entity extends ObjectLiteral> {
  total: number
  page: number
  count: number
  items: Entity[]
}

type order = 'ASC' | 'DESC'

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User
  }
}

interface Changes {
  added: ObjectLiteral[]
  removed: ObjectLiteral[]
  updated: ObjectLiteral[]
}

interface PostSubscriptionResponse {
  stripe: {
    subscriptionId: Stripe.Subscription['id']
    paymentIntentSecret: Stripe.PaymentIntent['client_secret']
  }
}
