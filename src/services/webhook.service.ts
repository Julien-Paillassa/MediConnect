import type Stripe from 'stripe'
import * as StripeClient from '../clients/stripe.client'
import * as SubscriptionService from './subscription.service'
import * as UserService from '../services/user.service'

export async function stripe (body: string, signature: unknown): Promise<void> {
  let event: Stripe.Event
  if (typeof signature !== 'string' &&
  !Buffer.isBuffer(signature) &&
  (!Array.isArray(signature) || !signature.every((item) => typeof item === 'string'))
  ) {
    throw new Error('Stripe webhook signature is not a string')
  }

  try {
    event = StripeClient.stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET ?? 'whsec_9ec52143ab96e23339945fcd98f04a5ba2e30ad73f3ff60c53125e3ff7a1b20b'
    )
  } catch (error) {
    console.error('Error verifying Stripe webhook signature:', error)
    throw new Error('Invalid Stripe webhook signature')
  }

  switch (event.type) {
    case 'invoice.payment_succeeded':
      try {
        const invoice = event.data.object
        await SubscriptionService.activate(invoice.subscription as string, invoice.customer as string)
        console.log('Subscription activated')
      } catch (error) {
        console.error('Error processing invoice.paid event:', error)
        throw new Error('Error while updating subscription after payment success')
      }

      break
    case 'invoice.payment_failed':
      try {
        const invoice = event.data.object
        await SubscriptionService.deactivate(invoice.subscription as string, invoice.customer as string)
        console.log('Subscription deactivated')
      } catch (error) {
        console.error('Error processing invoice.payment_failed event:', error)
        throw new Error('Error while updating subscription after payment failure')
      }
      break
    case 'customer.subscription.deleted':
      try {
        const subscription = event.data.object
        await SubscriptionService.cancel(subscription.id, subscription.customer as string)
        console.log('Subscription deleted')
      } catch (error) {
        console.error('Error processing customer.subscription.deleted event:', error)
        throw new Error('Error while deleting subscription')
      }
      break
    case 'customer.subscription.updated':
      try {
        const updatedSubscription = event.data.object

        if (typeof updatedSubscription.customer === 'string' && updatedSubscription.items?.data.length > 0) {
          const subscriptionItem = updatedSubscription.items.data[0]
          if (subscriptionItem.plan != null) {
            const user = await UserService.get(updatedSubscription.customer)
            const planId = subscriptionItem.plan.id
            await SubscriptionService.change(user, planId)
            console.log('Subscription plan changed')
          }
        }
      } catch (error) {
        console.error('Error processing customer.subscription.update event:', error)
        throw new Error('Error while updating subscription')
      }
      break
      // Uncomment the following code to enable stripe test mode
      // case 'customer.created':
      //   try {
      //     const customer = event.data.object
      //     await AppDataSource.manager.save(AppDataSource.manager.create('User', {
      //       id: customer.id,
      //       email: customer.email ?? 'email',
      //       password: 'password',
      //       name: customer.name ?? 'name'
      //     }))
      //     console.log('user created')
      //   } catch (error) {
      //     console.error('Error processing customer.created event:', error)
      //     throw new Error('Error while creating customer')
      //   }
      //   break
      // case 'price.created':
      //   try {
      //     const price = event.data.object
      //     await AppDataSource.manager.save(AppDataSource.manager.create('Plan', {
      //       id: price.id,
      //       name: price.nickname ?? 'name',
      //       ratePerMonth: '1000'
      //     }))
      //     console.log('plan created')
      //   } catch (error) {
      //     console.error('Error processing price.created event:', error)
      //     throw new Error('Error while creating price')
      //   }
      //   break
      // case 'customer.subscription.created':
      //   try {
      //     const subscription = event.data.object
      //     await AppDataSource.manager.save(AppDataSource.manager.create('Subscription', {
      //       id: subscription.id,
      //       userId: subscription.customer as string,
      //       planId: subscription.items.data[0].price.id,
      //       active: subscription.status === 'active'
      //     }))
      //     console.log('subscription created')
      //   } catch (error) {
      //     console.error('Error processing customer.subscription.created event:', error)
      //     throw new Error('Error while creating subscription')
      //   }
      //   break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }
}
