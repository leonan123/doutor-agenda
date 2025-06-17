import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/_lib/auth'

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/authentication')
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <pre className="font-mono">{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
