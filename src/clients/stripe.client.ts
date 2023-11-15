import { type PostSubscriptionResponse } from 'mediconnect'
import Stripe from 'stripe'

const stripeApiKey = process.env.STRIPE_SECRET_KEY as string
const stripe = new Stripe(stripeApiKey, {
  apiVersion: '2023-08-16',
  typescript: true
})

async function createPaymentIntent (
  subscriptionId: number,
  amount: number,
  currency: string,
  paymentMethodOptions?: object
): Promise<Stripe.PaymentIntent> {
  const params: Stripe.PaymentIntentCreateParams = {
    amount,
    currency,
    payment_method_types: ['card'],
    metadata: {
      subscriptionId
    }
  }

  if (paymentMethodOptions != null) {
    params.payment_method_options = paymentMethodOptions
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create(params)
    return paymentIntent
  } catch {
    throw new Error('Stripe payment intent creation failed')
  }
}

async function createSubscription (
  customerId: string,
  priceId: string
): Promise<PostSubscriptionResponse> {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    })

    if (subscription.latest_invoice == null ||
        typeof subscription.latest_invoice === 'string' ||
        subscription.latest_invoice.payment_intent === null ||
        typeof subscription.latest_invoice.payment_intent === 'string') {
      throw new Error('Stripe payment intent creation failed')
    }

    return {
      stripe: {
        subscriptionId: subscription.id,
        paymentIntentSecret: subscription.latest_invoice.payment_intent.client_secret
      }
    }
  } catch (error) {
    throw new Error('Stripe payment intent creation failed')
  }
}

async function createCustomer (email: string, name: string, address: Stripe.AddressParam): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    name,
    address
  })
}

export { createCustomer, createPaymentIntent, createSubscription, stripe }
