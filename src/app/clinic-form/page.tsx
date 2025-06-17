import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/_components/ui/dialog'

import { ClinicForm } from './components/form'

export default function ClinicFormPage() {
  return (
    <div>
      <Dialog open>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar clínica</DialogTitle>
            <DialogDescription>
              Adicione uma nova clínica ao seu perfil
            </DialogDescription>
          </DialogHeader>

          <ClinicForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}
