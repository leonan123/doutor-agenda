import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createMiddleware } from 'next-safe-action'

import { auth } from '@/_lib/auth'

export const authMiddleware = createMiddleware().define(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/authentication')
  }

  return next({
    ctx: {
      session,
    },
  })
})
