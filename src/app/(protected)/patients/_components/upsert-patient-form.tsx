'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { Loader2Icon, SaveIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { toast } from 'sonner'
import { z } from 'zod'

import { upsertPatient } from '@/_actions/upsert-patient'
import { Button } from '@/_components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form'
import { Input } from '@/_components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select'
import type { patientsTable } from '@/_db/schema'

const upsertPatientFormSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phoneNumber: z.string().min(1, 'O telefone é obrigatório'),
  sex: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'O sexo é obrigatório' }),
  }),
})

type UpsertPatientFormData = z.infer<typeof upsertPatientFormSchema>

type UpsertPatientFormProps = {
  patient?: typeof patientsTable.$inferSelect
}

export function UpsertPatientForm({ patient }: UpsertPatientFormProps) {
  const closeDialogButtonRef = useRef<HTMLButtonElement>(null)

  const form = useForm<UpsertPatientFormData>({
    resolver: zodResolver(upsertPatientFormSchema),
    defaultValues: {
      name: patient?.name ?? '',
      email: patient?.email ?? '',
      phoneNumber: patient?.phoneNumber ?? '',
      sex: patient?.sex ?? undefined,
    },
  })

  function handleDialogClose() {
    form.reset()
  }

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success(
        patient
          ? 'Paciente atualizado com sucesso!'
          : 'Paciente cadastrado com sucesso!',
      )
      closeDialogButtonRef.current?.click()
    },
  })

  function onSubmit(data: UpsertPatientFormData) {
    upsertPatientAction.execute({
      ...data,
      id: patient?.id,
    })
  }

  return (
    <DialogContent onCloseAutoFocus={handleDialogClose}>
      <DialogHeader>
        <DialogTitle>
          {patient ? 'Editar paciente' : 'Novo paciente'}
        </DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para{' '}
          {patient ? 'editar o' : 'adicionar um novo'} paciente
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder='Ex: "João Silva"' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder='Ex: "joao@exemplo.com"'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="sex"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    customInput={Input}
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.value)
                    }}
                    placeholder='Ex: "(11) 99999-9999"'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="gap-2">
            <DialogClose ref={closeDialogButtonRef} asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit" disabled={upsertPatientAction.isPending}>
              {upsertPatientAction.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <SaveIcon className="h-4 w-4" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
