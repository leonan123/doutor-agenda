'use client'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/_components/ui/button'
import { Dialog, DialogTrigger } from '@/_components/ui/dialog'

import { UpsertDoctorForm } from './upsert-doctor-form'

export function AddDoctorButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar médico
        </Button>
      </DialogTrigger>

      <UpsertDoctorForm />
    </Dialog>
  )
}
