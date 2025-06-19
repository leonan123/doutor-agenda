import { asc, eq } from 'drizzle-orm'
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
import { doctorsTable } from '@/_db/schema'
import { auth } from '@/_lib/auth'

import { AddDoctorButton } from './_components/add-doctor-button'
import { DoctorCard } from './_components/doctor-card'

export default async function DoctorsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/authentication')
  }

  if (!session.user.clinic.id) {
    redirect('/clinic-form')
  }

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session.user.clinic.id),
    orderBy: [asc(doctorsTable.createdAt)],
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clinica.</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        <div className="grid gap-6 sm:grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  )
}
