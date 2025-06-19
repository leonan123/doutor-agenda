import { asc } from 'drizzle-orm'

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
import { patientsTable } from '@/_db/schema'

import { AddPatientButton } from './_components/add-patient-button'
import { columns } from './_components/table-columns'

export default async function PatientsPage() {
  const patients = await db.query.patientsTable.findMany({
    orderBy: [asc(patientsTable.createdAt)],
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clinica.
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        <DataTable data={patients} columns={columns} />
      </PageContent>
    </PageContainer>
  )
}
