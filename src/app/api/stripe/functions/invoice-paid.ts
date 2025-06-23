import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'

import { db } from '@/_db'
import { usersTable } from '@/_db/schema'

interface InvoicePaidResponse {
  message: string
  success: boolean
  status: number
}

export async function invoicePaid(
  invoice: Stripe.Invoice,
): Promise<InvoicePaidResponse> {
  if (!invoice.id) {
    return {
      message: 'Invoice id not found.',
      success: false,
      status: 400,
    }
  }

  const subscriptionId = invoice.parent?.subscription_details
    ?.subscription as string

  if (!subscriptionId) {
    return {
      message: 'Subscription id not found.',
      success: false,
      status: 400,
    }
  }

  const userId = invoice.parent?.subscription_details?.metadata?.userId

  if (!userId) {
    return {
      message: 'User id not found.',
      success: false,
      status: 400,
    }
  }

  const customer = invoice.customer

  await db
    .update(usersTable)
    .set({
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customer as string,
      plan: 'essential',
    })
    .where(eq(usersTable.id, userId))

  return {
    message: 'Invoice paid successfully.',
    success: true,
    status: 200,
  }
}
