import { HospitalIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/_components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { Progress } from '@/_components/ui/progress'
import { ScrollArea } from '@/_components/ui/scroll-area'
import { Separator } from '@/_components/ui/separator'
import { getSpecialtyIcon } from '@/_helpers/get-specialty-icon'

interface TopSpecialtiesProps {
  totalAppointments: number
  topSpecialties: {
    name: string
    appointmentsCount: number
  }[]
}

export function TopSpecialties({
  topSpecialties,
  totalAppointments,
}: TopSpecialtiesProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HospitalIcon size={16} />
          <CardTitle>Especialidades</CardTitle>
        </div>

        <Button
          variant="link"
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <Link href="/appointments">Ver todos</Link>
        </Button>
      </CardHeader>

      <div className="px-6">
        <Separator />
      </div>

      <CardContent>
        <ScrollArea
          className="h-[264px] w-full [&_[data-slot='scroll-area-scrollbar']]:translate-x-2"
          type="always"
        >
          <div className="space-y-6">
            {topSpecialties.map((topSpecialty) => {
              const Icon = getSpecialtyIcon(topSpecialty.name)
              const progressValue =
                (topSpecialty.appointmentsCount / totalAppointments) * 100

              return (
                <div
                  className="flex items-center gap-4"
                  key={topSpecialty.name}
                >
                  <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-full">
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 space-y-1 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium">{topSpecialty.name}</h3>
                      <span className="text-muted-foreground text-sm font-semibold">
                        {topSpecialty.appointmentsCount} agend.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Progress value={progressValue} />
                      <span className="text-muted-foreground text-xs">
                        {progressValue.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
