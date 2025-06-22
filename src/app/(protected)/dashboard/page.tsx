import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { CalendarIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { DataTable } from '@/_components/ui/data-table'
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/_components/ui/page-container'
import { getDashboard } from '@/_data/get-dashboard'
import { db } from '@/_db'
import { usersToClinicsTable } from '@/_db/schema'
import { auth } from '@/_lib/auth'

import { columns } from '../appointments/_components/table-columns'
import { AppointmentsChart } from './_components/appointments-chart'
import { DatePickerWithRange } from './_components/date-picker'
import { StatsCards } from './_components/stats-cards'
import { TopDoctors } from './_components/top-doctors'
import { TopSpecialties } from './_components/top-specialties'

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Acesse uma visão geral detalhada das principais métricas e resultados dos pacientes',
}

interface DashboardPageProps {
  searchParams: Promise<{ from: string; to: string }>
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/authentication')
  }

  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  })

  if (clinics.length === 0 || !session.user.clinic.id) {
    redirect('/clinic-form')
  }

  const { from, to } = await searchParams

  if (!from || !to) {
    const defaultSearchParams = new URLSearchParams()
    defaultSearchParams.set('from', dayjs().format('YYYY-MM-DD'))
    defaultSearchParams.set('to', dayjs().add(1, 'month').format('YYYY-MM-DD'))

    redirect(`/dashboard?${defaultSearchParams.toString()}`)
  }

  const {
    totalAppointments,
    totalDoctors,
    totalPatients,
    totalRevenue,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  } = await getDashboard({
    session,
    from,
    to,
  })

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

      <PageContent>
        <StatsCards
          totalAppointments={totalAppointments?.total ?? 0}
          totalDoctors={totalDoctors?.total ?? 0}
          totalPatients={totalPatients?.total ?? 0}
          totalRevenueInCents={totalRevenue?.total ?? '0'}
        />
      </PageContent>

      <div className="grid grid-cols-1 gap-4 overflow-hidden pb-2 lg:h-[400px] lg:grid-cols-3 xl:grid-cols-[2.25fr_1fr]">
        <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
        <TopDoctors doctors={topDoctors} />
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-hidden pb-2 lg:h-[400px] lg:grid-cols-3 xl:grid-cols-[2.25fr_1fr]">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <CalendarIcon size={16} />
            <CardTitle>Agendamentos de hoje</CardTitle>
          </CardHeader>

          <CardContent>
            <DataTable columns={columns} data={todayAppointments} />
          </CardContent>
        </Card>

        <TopSpecialties
          topSpecialties={topSpecialties}
          totalAppointments={totalAppointments.total}
        />
      </div>
    </PageContainer>
  )
}
