'use client'

import 'dayjs/locale/pt-br'

import dayjs from 'dayjs'
import { DollarSignIcon } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/_components/ui/chart'
import { formatCurrencyInCents } from '@/_helpers/currency'

dayjs.locale('pt-br')

export const description = 'Agendamentos e faturamento'

const chartConfig = {
  appointments: {
    label: 'Agendamentos',
    color: 'var(--chart-1)',
  },
  revenue: {
    label: 'Faturamento',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

interface RevenueChartProps {
  dailyAppointmentsData: {
    date: string
    appointments: number
    revenue: number
  }[]
}

export function AppointmentsChart({
  dailyAppointmentsData,
}: RevenueChartProps) {
  const chartDays = Array.from({ length: 21 }).map((_, index) =>
    dayjs()
      .subtract(10 - index, 'days')
      .format('YYYY-MM-DD'),
  )

  const chartData = chartDays.map((date) => {
    const dayData = dailyAppointmentsData.find((item) => item.date === date)

    return {
      date,
      appointments: dayData?.appointments || 0,
      revenue: dayData?.revenue || 0,
    }
  })

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
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => dayjs(value).format('DD/MM')}
            />

            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={0}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              tickFormatter={(value) => formatCurrencyInCents(value)}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return (
                        <>
                          <div className="size-3 rounded bg-[var(--chart-2)]" />
                          <span className="text-muted-foreground">
                            Faturamento:
                          </span>
                          <span className="font-semibold">
                            {formatCurrencyInCents(value as number)}
                          </span>
                        </>
                      )
                    }

                    return (
                      <>
                        <div className="size-3 rounded bg-[var(--chart-1)]" />
                        <span className="text-muted-foreground">
                          Agendamentos:
                        </span>
                        <span className="font-semibold">
                          {value.toLocaleString()}
                        </span>
                      </>
                    )
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return dayjs(payload[0].payload.date).format(
                        'DD/MM/YYYY (dddd)',
                      )
                    }

                    return label
                  }}
                />
              }
            />

            <defs>
              <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-appointments)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-appointments)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="appointments"
              yAxisId="left"
              type="monotone"
              fill="url(#fillAppointments)"
              stroke="var(--color-appointments)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              fill="url(#fillRevenue)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
