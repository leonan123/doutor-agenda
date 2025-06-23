import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'

import { db } from '@/_db'
import { usersTable } from '@/_db/schema'

interface customerSubscriptionCanceledResponse {
  message: string
  success: boolean
  status: number
}

export async function customerSubscriptionCanceled(
  subscription: Stripe.Subscription,
): Promise<customerSubscriptionCanceledResponse> {
  const subscriptionId = subscription.id

  if (!subscriptionId) {
    return {
      message: 'Subscription id not found.',
      success: false,
      status: 400,
    }
  }

  const userId = subscription.metadata.userId

  if (!userId) {
    return {
      message: 'User id not found.',
      success: false,
      status: 400,
    }
  }

  await db
    .update(usersTable)
    .set({
      stripeSubscriptionId: null,
      stripeCustomerId: null,
      plan: null,
    })
    .where(eq(usersTable.id, userId))

  return {
    message: 'Subscription canceled.',
    success: true,
    status: 200,
  }
}
