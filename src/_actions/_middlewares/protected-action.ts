import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/_lib/auth'

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

export function protectedAction<T extends unknown[], R>(
  action: (session: Session, ...args: T) => Promise<R>,
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      redirect('/authentication')
    }

    return action(session as Session, ...args)
  }
}
