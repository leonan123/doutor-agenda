'use client'

import { CalendarIcon, ClockIcon, DollarSignIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/_components/ui/avatar'
import { Badge } from '@/_components/ui/badge'
import { Button } from '@/_components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/_components/ui/card'
import { Dialog, DialogTrigger } from '@/_components/ui/dialog'
import { Separator } from '@/_components/ui/separator'
import type { doctorsTable } from '@/_db/schema'
import { formatCurrencyInCents } from '@/_helpers/currency'
import { extractInitialsFromUsername } from '@/_helpers/extract-initials-from-username'
import { getAvailability } from '@/_helpers/get-availability'

import { UpsertDoctorForm } from './upsert-doctor-form'

interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const doctorInitials = extractInitialsFromUsername(doctor.name)
  const availability = getAvailability(doctor)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="size-16">
            <AvatarFallback className="font-semibold">
              {doctorInitials}
            </AvatarFallback>
          </Avatar>

          <div className="text-sm font-medium">
            <h3>{doctor.name}</h3>
            <p className="text-muted-foreground">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>

      <div className="px-6">
        <Separator />
      </div>

      <CardContent className="flex flex-col gap-2.5">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          <span>
            {availability.from.format('dddd')} a{' '}
            {availability.to.format('dddd')}
          </span>
        </Badge>

        <Badge variant="outline">
          <ClockIcon className="mr-1" />
          <span>
            {availability.from.format('HH:mm')} -{' '}
            {availability.to.format('HH:mm')}
          </span>
        </Badge>

        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          <span>{formatCurrencyInCents(doctor.appointmentPriceInCents)}</span>
        </Badge>
      </CardContent>

      <div className="px-6">
        <Separator />
      </div>

      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>

          <UpsertDoctorForm />
        </Dialog>
      </CardFooter>
    </Card>
  )
}
