import { asc, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

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
import { db } from '@/_db'
import { appointmentsTable, doctorsTable, patientsTable } from '@/_db/schema'
import { auth } from '@/_lib/auth'

import { AddAppointmentButton } from './_components/add-appointment-button'
import { columns } from './_components/table-columns'

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.clinic.id) {
    redirect('/clinic-form')
  }

  const [patients, doctors, appointments] = await Promise.all([
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, session.user.clinic.id),
      orderBy: [asc(patientsTable.name)],
    }),

    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, session.user.clinic.id),
      orderBy: [asc(doctorsTable.name)],
    }),

    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.clinicId, session.user.clinic.id),
      orderBy: [desc(appointmentsTable.date)],
      with: {
        patient: true,
        doctor: true,
      },
    }),
  ])

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica.
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>

      <PageContent className="h-full rounded-lg bg-white px-6 py-5 shadow-sm">
        <DataTable data={appointments} columns={columns} />
      </PageContent>
    </PageContainer>
  )
}
