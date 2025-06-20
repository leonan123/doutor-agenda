'use client'

import { Trash2Icon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import { deleteAppointment } from '@/_actions/delete-appointment'
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
import { type appointmentsTable } from '@/_db/schema'

interface DeleteAppointmentButtonProps {
  appointment: typeof appointmentsTable.$inferSelect
}

export function DeleteAppointmentButton({
  appointment,
}: DeleteAppointmentButtonProps) {
  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success('Agendamento excluído com sucesso')
      revalidatePathAction('/appointments')
    },
    onError: () => {
      toast.error('Erro ao excluir agendamento')
    },
  })

  function handleDeleteClick() {
    deleteAppointmentAction.execute({
      id: appointment.id,
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir agendamento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este agendamento? Esta ação não pode
            ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteClick}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
