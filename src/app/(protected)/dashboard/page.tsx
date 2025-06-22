import dayjs from 'dayjs'
import { and, count, desc, eq, gte, lte, sql, sum } from 'drizzle-orm'
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
import {
  appointmentsTable,
  doctorsTable,
  patientsTable,
  usersToClinicsTable,
} from '@/_db/schema'
import { auth } from '@/_lib/auth'

import { AppointmentsChart } from './_components/appointments-chart'
import { DatePickerWithRange } from './_components/date-picker'
import { StatsCards } from './_components/stats-cards'
import { TopDoctors } from './_components/top-doctors'

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

  const [
    [totalRevenue],
    [totalPatients],
    [totalDoctors],
    [totalAppointments],
    topDoctors,
  ] = await Promise.all([
    db
      .select({
        total: sum(appointmentsTable.appointmentPriceInCents),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    db
      .select({
        total: count(),
      })
      .from(patientsTable)
      .where(eq(patientsTable.clinicId, session.user.clinic.id)),
    db
      .select({
        total: count(),
      })
      .from(doctorsTable)
      .where(eq(doctorsTable.clinicId, session.user.clinic.id)),
    db
      .select({
        total: count(),
      })
      .from(appointmentsTable)
      .where(eq(appointmentsTable.clinicId, session.user.clinic.id)),
    db
      .select({
        id: doctorsTable.id,
        name: doctorsTable.name,
        avatarImageUrl: doctorsTable.avatarImageUrl,
        specialty: doctorsTable.specialty,
        appointmentsCount: count(appointmentsTable.id),
      })
      .from(doctorsTable)
      .leftJoin(
        appointmentsTable,
        and(
          eq(appointmentsTable.doctorId, doctorsTable.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .where(eq(doctorsTable.clinicId, session.user.clinic.id))
      .groupBy(doctorsTable.id)
      .orderBy(desc(count(appointmentsTable.id))),
  ])

  const chartStartDate = dayjs().subtract(10, 'days').startOf('day').toDate()
  const chartEndDate = dayjs().add(10, 'days').endOf('day').toDate()

  const dailyAppointmentsData = await db
    .select({
      date: sql<string>`DATE(${appointmentsTable.date})`.as('date'),
      appointments: count(appointmentsTable.id).as('total'),
      revenue:
        sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as(
          'revenue',
        ),
    })
    .from(appointmentsTable)
    .where(
      and(
        eq(appointmentsTable.clinicId, session.user.clinic.id),
        gte(appointmentsTable.date, chartStartDate),
        lte(appointmentsTable.date, chartEndDate),
      ),
    )
    .groupBy(sql`DATE(${appointmentsTable.date})`)
    .orderBy(sql`DATE(${appointmentsTable.date})`)
    .limit(10)

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
    </PageContainer>
  )
}
