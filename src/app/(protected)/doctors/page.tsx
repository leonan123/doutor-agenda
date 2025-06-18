import { PlusIcon } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Button } from '@/_components/ui/button'
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/_components/ui/page-container'
import { auth } from '@/_lib/auth'

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

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clinica.</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <Button>
            <PlusIcon />
            Adicionar médico
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <h1>Médicos</h1>
      </PageContent>
    </PageContainer>
  )
}
