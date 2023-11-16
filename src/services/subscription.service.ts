import { type PostSubscriptionResponse } from 'mediconnect'
import { type FindOptionsWhere } from 'typeorm'
import * as StripeClient from '../clients/stripe.client'
import AppDataSource from '../data-source'
import { Subscription } from '../entity/Subscription'
import { type User } from '../entity/User'
import * as UserService from './user.service'
import * as PlanService from './plan.service'

export async function get (criteria: FindOptionsWhere<Subscription>): Promise<Subscription> {
  const subscription = await AppDataSource.manager.findOne(
    Subscription,
    { where: criteria }
  )
  if (subscription == null) {
    throw new Error('Subscription not found')
  }
  return subscription
}

export async function subscribe (
  user: User,
  planId: string
): Promise<PostSubscriptionResponse> {
  if (planId.length === 0) throw new Error('Plan ID is required')

  const plan = await PlanService.get(planId)

  const stripeSubscription = await StripeClient.createSubscription(user.id, plan.id)

  if (stripeSubscription.latest_invoice == null ||
    typeof stripeSubscription.latest_invoice === 'string' ||
    stripeSubscription.latest_invoice.payment_intent === null ||
    typeof stripeSubscription.latest_invoice.payment_intent === 'string') {
    throw new Error('Stripe payment intent creation failed')
  }

  const subscription = new Subscription()
  subscription.id = stripeSubscription.id
  subscription.userId = user.id
  subscription.planId = plan.id
  await AppDataSource.manager.save(Subscription, subscription)

  return {
    stripe: {
      subscriptionId: stripeSubscription.id,
      paymentIntentSecret: stripeSubscription.latest_invoice.payment_intent.client_secret
    }
  }
}

export async function activate (id: string, user: string | User): Promise<Subscription | null> {
  if (typeof user === 'string') {
    user = await UserService.get(user)
  }

  const subscription = await get({ id, userId: user.id })
  if (subscription.active) {
    return subscription
  } else {
    subscription.active = true
    await AppDataSource.manager.save(Subscription, subscription)
    return subscription
  }
}

export async function deactivate (id: string, user: string | User): Promise<Subscription | null> {
  if (typeof user === 'string') {
    user = await UserService.get(user)
  }

  const subscription = await get({ id, userId: user.id })
  if (!subscription.active) {
    return subscription
  } else {
    subscription.active = false
    await AppDataSource.manager.save(Subscription, subscription)
    return subscription
  }
}

export async function cancel (id: string, user: string | User): Promise<void> {
  if (typeof user === 'string') {
    user = await UserService.get(user)
  }

  const subscriptions = await get({ id, userId: user.id })
  await AppDataSource.manager.remove(subscriptions)
}

export async function change (user: User, newPlanId: string): Promise<PostSubscriptionResponse> {
  const currentSubscription = await AppDataSource.manager.findOne(Subscription, {
    where: { userId: user.id, active: true }
  })

  if (currentSubscription == null) {
    throw new Error('Active subscription not found')
  }

  const newPlan = await PlanService.get(newPlanId)
  const stripeSubscription = await StripeClient.updateSubscription(currentSubscription.id, newPlan.id)
  console.log('stripeSubscription : ', stripeSubscription)
  if (stripeSubscription.latest_invoice == null ||
    typeof stripeSubscription.latest_invoice === 'string' ||
    stripeSubscription.latest_invoice.payment_intent === null ||
    typeof stripeSubscription.latest_invoice.payment_intent === 'string') {
    throw new Error('Stripe payment intent creation failed')
  }

  currentSubscription.planId = newPlan.id
  currentSubscription.active = false
  await AppDataSource.manager.save(Subscription, currentSubscription)

  return {
    stripe: {
      subscriptionId: stripeSubscription.id,
      paymentIntentSecret: stripeSubscription.latest_invoice.payment_intent.client_secret
    }
  }
}
