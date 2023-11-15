import { type PostSubscriptionResponse } from 'mediconnect'
import type Stripe from 'stripe'
import * as StripeClient from '../clients/stripe.client'
import AppDataSource from '../data-source'
import { Plan } from '../entity/Plan'
import { Subscription } from '../entity/Subscription'
import { type User } from '../entity/User'

export async function subscribe (
  user: User,
  planId: string
): Promise<PostSubscriptionResponse> {
  if (planId == null) {
    throw new Error('Plan ID is required')
  }
  const plan = await AppDataSource.manager.findOneOrFail(Plan, {
    where: { id: planId }
  })
  const subscription = new Subscription()
  subscription.userId = user.id
  subscription.planId = plan.id
  await AppDataSource.manager.save(Subscription, subscription)
  try {
    return await StripeClient.createSubscription(user.id, plan.id)
  } catch (error) {
    await AppDataSource.manager.remove(subscription)
    throw error
  }
}

export async function cancel (user: User): Promise<void> {
  // TODO: cancel subscription on Stripe
  const subscriptions = await AppDataSource.manager.find(
    Subscription,
    { where: { userId: user.id } }
  )
  await AppDataSource.manager.remove(subscriptions)
}

export async function webhook (body: string, signature: string): Promise<void> {
  let event: Stripe.Event
  try {
    event = StripeClient.stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY ?? ''
    )

    const eventType = event.type

    switch (eventType) {
      case 'invoice.paid':
        try {
          const invoice = event.data.object

          if (typeof invoice.subscription !== 'string') {
            throw new Error('Subscription ID is not a string')
          }

          const planId = invoice.subscription

          const subscription = await AppDataSource.manager.findOne(
            Subscription,
            { where: { planId } }
          )
          if (subscription == null) {
            throw new Error('Subscription not found')
          }

          subscription.active = true
          await AppDataSource.manager.save(Subscription, subscription)
        } catch (error) {
          console.error('Error processing invoice.paid event:', error)
          throw new Error('Error while updated subscription')
        }
        break
      case 'invoice.payment_failed':
        try {
          const invoice = event.data.object

          if (typeof invoice.subscription !== 'string') {
            throw new Error('Subscription ID is not a string')
          }

          const planId = invoice.subscription
          const subscription = await AppDataSource.manager.findOne(
            Subscription,
            { where: { planId } }
          )

          if (subscription == null) {
            throw new Error('Subscription not found')
          }

          subscription.active = false
          await AppDataSource.manager.save(Subscription, subscription)
        } catch (error) {
          console.error(
            'Error processing invoice.payment_failed event:',
            error
          )
          throw new Error('Error while handling payment failure')
        }
        break

      case 'customer.subscription.deleted':
        try {
          const subscriptionEvent = event.data.object

          const subscription = await AppDataSource.manager.findOne(
            Subscription,
            { where: { planId: subscriptionEvent.id } }
          )

          if (subscription == null) {
            throw new Error('User subscription not found')
          }

          await AppDataSource.manager.remove(
            Subscription,
            subscription
          )
        } catch (error) {
          console.error(
            'Error processing customer.subscription.deleted event:',
            error
          )
          throw new Error('Error while handling subscription deletion')
        }
        break

      default:
        throw new Error(`Unsupported stripe event type : ${eventType}`)
    }
  } catch {
    throw new Error('A webhook signature verification failed')
  }
}
