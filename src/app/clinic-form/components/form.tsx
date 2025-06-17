'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createClinic } from '@/_actions/create-clinic'
import { Button } from '@/_components/ui/button'
import { DialogFooter } from '@/_components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form'
import { Input } from '@/_components/ui/input'

const clinicFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
})

type ClinicFormData = z.infer<typeof clinicFormSchema>

export function ClinicForm() {
  const router = useRouter()

  const form = useForm<ClinicFormData>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: ClinicFormData) {
    try {
      await createClinic(data.name)
      router.push('/dashboard')
    } catch (error) {
      console.error(error)

      toast.error('Erro ao criar clínica, tente novamente', {
        className: 'z-50',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>

              <FormControl>
                <Input placeholder="Digite o nome da clínica" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Criar clínica
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
