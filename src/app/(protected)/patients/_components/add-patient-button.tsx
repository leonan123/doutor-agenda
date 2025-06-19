'use client'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/_components/ui/button'
import { Dialog, DialogTrigger } from '@/_components/ui/dialog'

import { UpsertPatientForm } from './upsert-patient-form'

export function AddPatientButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Adicionar paciente
        </Button>
      </DialogTrigger>

      <UpsertPatientForm />
    </Dialog>
  )
}
