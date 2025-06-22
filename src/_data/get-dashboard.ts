import dayjs from 'dayjs'
import { and, count, desc, eq, gte, lte, sql, sum } from 'drizzle-orm'

import { db } from '@/_db'
import { appointmentsTable, doctorsTable, patientsTable } from '@/_db/schema'
import type { auth } from '@/_lib/auth'

interface GetDashboardProps {
  from: string
  to: string
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
}

export async function getDashboard({ session, from, to }: GetDashboardProps) {
  const chartStartDate = dayjs().subtract(10, 'days').startOf('day').toDate()
  const chartEndDate = dayjs().add(10, 'days').endOf('day').toDate()

  const [
    [totalRevenue],
    [totalPatients],
    [totalDoctors],
    [totalAppointments],
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  ] = await Promise.all([
    db
      .select({
        total: sum(appointmentsTable.appointmentPriceInCents),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id!),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    db
      .select({
        total: count(),
      })
      .from(patientsTable)
      .where(eq(patientsTable.clinicId, session.user.clinic.id!)),
    db
      .select({
        total: count(),
      })
      .from(doctorsTable)
      .where(eq(doctorsTable.clinicId, session.user.clinic.id!)),
    db
      .select({
        total: count(),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id!),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
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
      .where(eq(doctorsTable.clinicId, session.user.clinic.id!))
      .groupBy(doctorsTable.id)
      .orderBy(desc(count(appointmentsTable.id))),
    db
      .select({
        name: doctorsTable.specialty,
        appointmentsCount: count(appointmentsTable.id),
      })
      .from(appointmentsTable)
      .innerJoin(doctorsTable, eq(doctorsTable.id, appointmentsTable.doctorId))
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id!),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .groupBy(doctorsTable.specialty)
      .orderBy(desc(count(appointmentsTable.id))),
    db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.clinicId, session.user.clinic.id!),
        gte(appointmentsTable.date, dayjs().startOf('day').toDate()),
        lte(appointmentsTable.date, dayjs().endOf('day').toDate()),
      ),
      with: {
        patient: true,
        doctor: true,
      },
    }),
    db
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
          eq(appointmentsTable.clinicId, session.user.clinic.id!),
          gte(appointmentsTable.date, chartStartDate),
          lte(appointmentsTable.date, chartEndDate),
        ),
      )
      .groupBy(sql`DATE(${appointmentsTable.date})`)
      .orderBy(sql`DATE(${appointmentsTable.date})`)
      .limit(10),
  ])

  return {
    totalRevenue,
    totalPatients,
    totalDoctors,
    totalAppointments,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  }
}
