import { asc } from 'drizzle-orm'

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
import { doctorsTable, patientsTable } from '@/_db/schema'

import { AddAppointmentButton } from './_components/add-appointment-button'

export default async function AppointmentsPage() {
  const [patients, doctors] = await Promise.all([
    db.query.patientsTable.findMany({
      orderBy: [asc(patientsTable.name)],
    }),
    db.query.doctorsTable.findMany({
      orderBy: [asc(doctorsTable.name)],
    }),
  ])

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>

      <PageContent>
        {/* We'll add the appointments table here later */}
      </PageContent>
    </PageContainer>
  )
}
