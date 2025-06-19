'use client'

import { Trash2Icon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import { deleteDoctor } from '@/_actions/delete-doctor'
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

interface DeleteDoctorButtonProps {
  doctorId: string
}

export function DeleteDoctorButton({ doctorId }: DeleteDoctorButtonProps) {
  const deleteDoctorAction = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success('Médico excluído com sucesso')
      revalidatePathAction('/doctors')
    },
    onError: () => {
      toast.error('Erro ao excluir médico, tente novamente')
    },
  })

  function handleDeleteDoctorClick() {
    deleteDoctorAction.execute({
      id: doctorId,
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          <Trash2Icon />
          <span className="sr-only">Excluir</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente os
            dados do médico e todas as suas consultas agendadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteDoctorClick}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
