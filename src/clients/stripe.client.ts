import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-08-16', typescript: true })

export async function createSubscription (customerId: string, priceId: string): Promise<Stripe.Response<Stripe.Subscription>> {
  try {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    })
  } catch (error) {
    throw new Error('Stripe payment intent creation failed')
  }
}

export async function createCustomer (email: string, name: string, address: Stripe.AddressParam): Promise<Stripe.Customer> {
  return await stripe.customers.create({ email, name, address })
}
