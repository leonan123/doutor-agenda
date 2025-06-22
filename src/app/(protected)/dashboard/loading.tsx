import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/_components/ui/page-container'

import { DatePickerWithRange } from './_components/date-picker'
import { AppointmentsChartSkeleton } from './_components/skeletons/appointments-chart-skeleton'
import { StatsCardsSkeleton } from './_components/skeletons/stats-cards-skeleton'
import { TopDoctorsSkeleton } from './_components/skeletons/top-doctors-skeleton'

export default function DashboardLoading() {
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
        <StatsCardsSkeleton />
      </PageContent>

      <div className="grid grid-cols-1 gap-4 overflow-hidden pb-2 lg:h-[400px] lg:grid-cols-3 xl:grid-cols-[2.25fr_1fr]">
        <AppointmentsChartSkeleton />
        <TopDoctorsSkeleton />
      </div>
    </PageContainer>
  )
}
