import {
  CalendarDaysIcon,
  DollarSign,
  StethoscopeIcon,
  UsersIcon,
} from 'lucide-react'

import { formatCurrencyInCents } from '@/_helpers/currency'

import { StatCardItem } from './stat-card-item'

interface StatsCardsProps {
  totalRevenueInCents: string
  totalPatients: number
  totalDoctors: number
  totalAppointments: number
}

export function StatsCards({
  totalAppointments,
  totalDoctors,
  totalPatients,
  totalRevenueInCents,
}: StatsCardsProps) {
  const stats = [
    {
      icon: DollarSign,
      label: 'Faturamento',
      value: totalRevenueInCents,
      formatter: (value: string | number) =>
        formatCurrencyInCents(Number(value)),
    },
    {
      icon: CalendarDaysIcon,
      label: 'Agendamentos',
      value: totalAppointments,
    },
    {
      icon: UsersIcon,
      label: 'Pacientes',
      value: totalPatients,
    },
    {
      icon: StethoscopeIcon,
      label: 'Médicos',
      value: totalDoctors,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCardItem key={stat.label} {...stat} />
      ))}
    </div>
  )
}
