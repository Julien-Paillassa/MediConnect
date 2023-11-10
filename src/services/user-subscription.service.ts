import type Stripe from 'stripe'
import * as StripeClient from '../clients/stripe.client'
import { Subscription } from '../entity/Subscription'
import AppDataSource from '../data-source'
import { type User } from '../entity/User'
import { UserSubscription } from '../entity/UserSubscription'

export async function subscribe (user: User, subscriptionId: string): Promise<Subscription> {
  const subscription = await AppDataSource.manager.findOneOrFail(Subscription, { where: { id: subscriptionId } })
  const userSubscription = new UserSubscription()
  userSubscription.userId = user.id
  userSubscription.subscriptionId = subscription.id
  await AppDataSource.manager.save(UserSubscription, userSubscription)
  try {
    await StripeClient.createSubscription(user.id, subscription.id)

    return subscription
  } catch (error) {
    await AppDataSource.manager.remove(userSubscription)
    throw error
  }
}

export async function webhook (body: string, signature: string): Promise<void> {
  let event: Stripe.Event
  try {
    event = StripeClient.stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_KEY ?? '')

    const eventType = event.type

    switch (eventType) {
      case 'invoice.paid' :
        try {
          const invoice = event.data.object

          if (typeof invoice.subscription !== 'string') {
            throw new Error('Subscription ID is not a string')
          }

          const subscriptionId = invoice.subscription

          const userSubscription = await AppDataSource.manager.findOne(UserSubscription, {
            where: { subscriptionId }
          })
          if (userSubscription == null) {
            throw new Error('Subscription not found')
          }

          userSubscription.active = true
          await AppDataSource.manager.save(UserSubscription, userSubscription)
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

          const subscriptionId = invoice.subscription
          const userSubscription = await AppDataSource.manager.findOne(UserSubscription, {
            where: { subscriptionId }
          })

          if (userSubscription == null) {
            throw new Error('Subscription not found')
          }

          userSubscription.active = false
          await AppDataSource.manager.save(UserSubscription, userSubscription)
        } catch (error) {
          console.error('Error processing invoice.payment_failed event:', error)
          throw new Error('Error while handling payment failure')
        }
        break

      case 'customer.subscription.deleted':
        try {
          const subscriptionEvent = event.data.object

          const userSubscription = await AppDataSource.manager.findOne(UserSubscription, {
            where: { subscriptionId: subscriptionEvent.id }
          })

          if (userSubscription == null) {
            throw new Error('User subscription not found')
          }

          await AppDataSource.manager.remove(UserSubscription, userSubscription)
        } catch (error) {
          console.error('Error processing customer.subscription.deleted event:', error)
          throw new Error('Error while handling subscription deletion')
        }
        break

      default : throw new Error(`Unsupported stripe event type : ${eventType}`)
    }
  } catch {
    throw new Error('A webhook signature verification failed')
  }
}
