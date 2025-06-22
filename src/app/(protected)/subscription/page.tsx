import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/_components/ui/page-container'

import { AddDoctorButton } from '../doctors/_components/add-doctor-button'
import SubscriptionPlanCard from './_components/subscription-plan-card'

export default function SubscriptionPage() {
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
        <SubscriptionPlanCard />
      </PageContent>
    </PageContainer>
  )
}
