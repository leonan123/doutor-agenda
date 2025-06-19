import { MoreVerticalIcon, SquarePenIcon, TrashIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

import { deletePatient } from '@/_actions/delete-patient'
import { revalidatePathAction } from '@/_actions/revalidate-path'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog'
import { Button } from '@/_components/ui/button'
import { Dialog, DialogTrigger } from '@/_components/ui/dialog'
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success('Paciente excluído com sucesso')
      revalidatePathAction('/patients')
      setIsDropdownOpen(false)
    },
    onError: () => {
      toast.error('Erro ao excluir paciente, tente novamente')
    },
  })

  function handleDeletePatientClick() {
    deletePatientAction.execute({
      id: patient.id,
    })
  }

  return (
    <Dialog>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <DialogTrigger className="flex w-full items-center justify-between">
              Editar
              <SquarePenIcon className="size-4" />
            </DialogTrigger>
          </DropdownMenuItem>

          <AlertDialog
            onOpenChange={(open) => !open && setIsDropdownOpen(false)}
          >
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="flex items-center justify-between"
                onSelect={(e) => e.preventDefault()}
              >
                Excluir
                <TrashIcon className="size-4" />
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja excluir?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente
                  os dados do paciente.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePatientClick}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpsertPatientForm patient={patient} />
    </Dialog>
  )
}
