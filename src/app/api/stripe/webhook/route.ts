import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { customerSubscriptionCanceled } from '../functions/customer-subscription-canceled'
import { invoicePaid } from '../functions/invoice-paid'

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe secret key not found.')
  }

  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    throw new Error('Stripe signature not found.')
  }

  const body = await request.text()

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-05-28.basil',
  })

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 400 },
    )
  }

  if (event.type === 'invoice.paid') {
    const { success, status, message } = await invoicePaid(event.data.object)

    if (!success) {
      return NextResponse.json({ message }, { status })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const { success, status, message } = await customerSubscriptionCanceled(
      event.data.object,
    )

    if (!success) {
      return NextResponse.json({ message }, { status })
    }
  }

  return NextResponse.json({ received: true })
}
