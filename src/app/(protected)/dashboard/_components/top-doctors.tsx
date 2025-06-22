import { StethoscopeIcon } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback } from '@/_components/ui/avatar'
import { Button } from '@/_components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { ScrollArea } from '@/_components/ui/scroll-area'
import { Separator } from '@/_components/ui/separator'
import { extractInitialsFromUsername } from '@/_helpers/extract-initials-from-username'

interface TopDoctorsProps {
  doctors: {
    id: string
    name: string
    avatarImageUrl: string
    specialty: string
    appointmentsCount: number
  }[]
}

export function TopDoctors({ doctors }: TopDoctorsProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StethoscopeIcon size={16} />
          <CardTitle>Médicos</CardTitle>
        </div>

        <Button
          variant="link"
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <Link href="/doctors">Ver todos</Link>
        </Button>
      </CardHeader>

      <div className="px-6">
        <Separator />
      </div>

      <CardContent>
        <ScrollArea
          className="h-[264px] [&_[data-slot='scroll-area-scrollbar']]:translate-x-2"
          type="always"
        >
          <div className="space-y-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="size-14">
                    <AvatarFallback className="font-semibold">
                      {extractInitialsFromUsername(doctor.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-sm">
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-muted-foreground">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-muted-foreground text-sm font-semibold">
                    {doctor.appointmentsCount} agend.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
