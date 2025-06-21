import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/_components/ui/page-container'
import { db } from '@/_db'
import { usersToClinicsTable } from '@/_db/schema'
import { auth } from '@/_lib/auth'

import { DatePickerWithRange } from './_components/date-picker'

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Acesse uma visão geral detalhada das principais métricas e resultados dos pacientes',
}

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
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Acesse uma visão geral detalhada das principais métricas e
            resultados dos pacientes
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <DatePickerWithRange />
        </PageActions>
      </PageHeader>

      <PageContent className="h-full rounded-lg bg-white px-6 py-5 shadow-sm">
        {/* DADOS */}
      </PageContent>
    </PageContainer>
  )
}
