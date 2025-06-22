import {
  CalendarDaysIcon,
  DollarSign,
  StethoscopeIcon,
  UsersIcon,
} from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/_components/ui/card'

const stats = [
  {
    icon: DollarSign,
    label: 'Faturamento',
  },
  {
    icon: CalendarDaysIcon,
    label: 'Agendamentos',
  },
  {
    icon: UsersIcon,
    label: 'Pacientes',
  },
  {
    icon: StethoscopeIcon,
    label: 'Médicos',
  },
]

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="gap-2">
          <CardHeader className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
              <stat.icon size={16} />
            </div>
            <h3 className="text-muted-foreground text-sm font-semibold">
              {stat.label}
            </h3>
          </CardHeader>

          <CardContent>
            <div className="h-8 w-44 animate-pulse rounded-md bg-gray-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
