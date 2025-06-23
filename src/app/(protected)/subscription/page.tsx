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
import { auth } from '@/_lib/auth'

import { AddDoctorButton } from '../doctors/_components/add-doctor-button'
import SubscriptionPlanCard from './_components/subscription-plan-card'

export default async function SubscriptionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session?.user) {
    redirect('/authentication')
  }

  if (!session.user.clinic.id) {
    redirect('/clinic-form')
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencie a sua assinatura.</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        <SubscriptionPlanCard
          active={session.user.plan === 'essential'}
          userEmail={session.user.email}
        />
      </PageContent>
    </PageContainer>
  )
}
