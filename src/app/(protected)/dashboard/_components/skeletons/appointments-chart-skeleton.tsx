import 'dayjs/locale/pt-br'

import { DollarSignIcon } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card'

export function AppointmentsChartSkeleton() {
  return (
    <Card className="lg:col-span-2 xl:col-auto">
      <CardHeader className="flex items-start gap-3">
        <DollarSignIcon size={16} />

        <div className="space-y-0.5">
          <CardTitle>Agendamentos e faturamento</CardTitle>
          <CardDescription>
            Mostrando os agendamentos e faturamento dos últimos 20 dias.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="h-[280px] w-full">
        <div className="size-full animate-pulse rounded-md bg-gray-200" />
      </CardContent>
    </Card>
  )
}
