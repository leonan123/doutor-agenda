import { MoreVerticalIcon, SquarePenIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/_components/ui/button'
import { Dialog } from '@/_components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/_components/ui/dropdown-menu'
import { patientsTable } from '@/_db/schema'

import { UpsertPatientForm } from './upsert-patient-form'

interface TableActionsProps {
  patient: typeof patientsTable.$inferSelect
}

export function TableActions({ patient }: TableActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center justify-between"
            onClick={() => setIsDialogOpen(true)}
          >
            Editar
            <SquarePenIcon />
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center justify-between">
            Excluir
            <TrashIcon />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpsertPatientForm patient={patient} />
    </Dialog>
  )
}
