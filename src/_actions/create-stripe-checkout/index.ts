'use server'

import Stripe from 'stripe'

import { actionClient } from '@/_lib/next-safe-action'

import { authMiddleware } from '../_middlewares/auth'

export const createStripeCheckout = actionClient
  .use(authMiddleware)
  .action(async ({ ctx: { session } }) => {
    if (!session.user.clinic.id) {
      throw new Error('Clinic not found.')
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not found.')
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    })

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      subscription_data: {
        metadata: {
          userId: session.user.id,
          clinicId: session.user.clinic.id,
        },
      },
      line_items: [
        {
          price: process.env.STRIPE_ESSENTIAL_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
    })

    return {
      sessionId: stripeSession.id,
    }
  })
