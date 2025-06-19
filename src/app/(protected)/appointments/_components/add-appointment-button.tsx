'use client'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/_components/ui/button'
import { Dialog, DialogTrigger } from '@/_components/ui/dialog'
import type { doctorsTable, patientsTable } from '@/_db/schema'

import { UpsertAppointmentForm } from './upsert-appointment-form'

interface AddAppointmentButtonProps {
  patients: (typeof patientsTable.$inferSelect)[]
  doctors: (typeof doctorsTable.$inferSelect)[]
}

export function AddAppointmentButton({
  patients,
  doctors,
}: AddAppointmentButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo agendamento
        </Button>
      </DialogTrigger>

      <UpsertAppointmentForm patients={patients} doctors={doctors} />
    </Dialog>
  )
}
