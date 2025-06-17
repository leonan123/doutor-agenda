import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { db } from '@/_db'
import { usersToClinicsTable } from '@/_db/schema'
import { auth } from '@/_lib/auth'

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/authentication')
  }

  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  })

  if (clinics.length === 0) {
    redirect('/clinic-form')
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {/* <pre className="font-mono">{JSON.stringify(session, null, 2)}</pre> */}
    </div>
  )
}
