import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { Loader2Icon, SaveIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import { z } from 'zod'

import { upsertDoctor } from '@/_actions/upsert-doctor'
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select'
import type { doctorsTable } from '@/_db/schema'

import { medicalSpecialties } from '../_constants'

const upsertDoctorSchema = z
  .object({
    name: z.string().trim().min(1, 'O nome é obrigatório'),
    specialty: z.string().trim().min(1, 'A especialidade é obrigatória'),
    appointmentsPrice: z.number().min(1, 'O preço da consulta é obrigatório'),
    availableFromWeekday: z
      .string()
      .trim()
      .min(1, 'O dia da semana é obrigatório'),
    availableToWeekday: z
      .string()
      .trim()
      .min(1, 'O dia da semana é obrigatório'),
    availableFromTime: z
      .string()
      .trim()
      .min(1, 'A hora de início é obrigatória'),
    availableToTime: z
      .string()
      .trim()
      .min(1, 'A hora de término é obrigatória'),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime
    },
    {
      message: 'A hora de término deve ser posterior à hora de início',
      path: ['availableToTime'],
    },
  )

type UpsertDoctorFormData = z.infer<typeof upsertDoctorSchema>

interface UpsertDoctorFormProps {
  doctor?: typeof doctorsTable.$inferSelect
}

export function UpsertDoctorForm({ doctor }: UpsertDoctorFormProps) {
  const closeDialogButtonRef = useRef<HTMLButtonElement>(null)
  const form = useForm<UpsertDoctorFormData>({
    shouldUnregister: true,
    resolver: zodResolver(upsertDoctorSchema),
    defaultValues: {
      name: doctor?.name ?? '',
      specialty: doctor?.specialty ?? '',
      appointmentsPrice: doctor?.appointmentPriceInCents
        ? doctor.appointmentPriceInCents / 100
        : 0,
      availableFromWeekday: doctor?.availableFromWeekday.toString() ?? '1',
      availableToWeekday: doctor?.availableToWeekday.toString() ?? '5',
      availableFromTime: doctor?.availableFromTime ?? '',
      availableToTime: doctor?.availableToTime ?? '',
    },
  })

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success('Médico adicionado com sucesso', {
        className: 'z-50',
        position: 'bottom-center',
      })
      closeDialogButtonRef.current?.click()
    },
    onError: () => {
      toast.error('Erro ao adicionar médico, tente novamente', {
        className: 'z-50',
      })
    },
  })

  function onSubmit(data: UpsertDoctorFormData) {
    upsertDoctorAction.execute({
      ...data,
      id: doctor?.id,
      availableFromWeekday: parseInt(data.availableFromWeekday),
      availableToWeekday: parseInt(data.availableToWeekday),
      appointmentPriceInCents: data.appointmentsPrice * 100,
    })
  }

  return (
    <DialogContent className="sm:max-w-[calc(100%-2rem)] md:max-w-3xl">
      <DialogHeader>
        <DialogTitle>{doctor ? 'Editar' : 'Adicionar'} médico</DialogTitle>
        <DialogDescription>
          {doctor
            ? 'Edite os dados do médico'
            : 'Adicione um novo médico ao seu perfil'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder='Ex: "Dr. João"' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="specialty"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicalSpecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="appointmentsPrice"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da consulta</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => field.onChange(value.floatValue)}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  prefix="R$ "
                  customInput={Input}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 place-items-baseline gap-4 sm:grid-cols-2">
            <FormField
              name="availableFromWeekday"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Dia inicial de disponibilidade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um dia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Domingo</SelectItem>
                      <SelectItem value="1">Segunda</SelectItem>
                      <SelectItem value="2">Terça</SelectItem>
                      <SelectItem value="3">Quarta</SelectItem>
                      <SelectItem value="4">Quinta</SelectItem>
                      <SelectItem value="5">Sexta</SelectItem>
                      <SelectItem value="6">Sábado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="availableToWeekday"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Dia final de disponibilidade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um dia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Domingo</SelectItem>
                      <SelectItem value="1">Segunda</SelectItem>
                      <SelectItem value="2">Terça</SelectItem>
                      <SelectItem value="3">Quarta</SelectItem>
                      <SelectItem value="4">Quinta</SelectItem>
                      <SelectItem value="5">Sexta</SelectItem>
                      <SelectItem value="6">Sábado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 place-items-baseline gap-4 sm:grid-cols-2">
            <FormField
              name="availableFromTime"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Horário inicial de disponibilidade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Manhã</SelectLabel>
                        <SelectItem value="05:00:00">05:00</SelectItem>
                        <SelectItem value="05:30:00">05:30</SelectItem>
                        <SelectItem value="06:00:00">06:00</SelectItem>
                        <SelectItem value="06:30:00">06:30</SelectItem>
                        <SelectItem value="07:00:00">07:00</SelectItem>
                        <SelectItem value="07:30:00">07:30</SelectItem>
                        <SelectItem value="08:00:00">08:00</SelectItem>
                        <SelectItem value="08:30:00">08:30</SelectItem>
                        <SelectItem value="09:00:00">09:00</SelectItem>
                        <SelectItem value="09:30:00">09:30</SelectItem>
                        <SelectItem value="10:00:00">10:00</SelectItem>
                        <SelectItem value="10:30:00">10:30</SelectItem>
                        <SelectItem value="11:00:00">11:00</SelectItem>
                        <SelectItem value="11:30:00">11:30</SelectItem>
                        <SelectItem value="12:00:00">12:00</SelectItem>
                        <SelectItem value="12:30:00">12:30</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Tarde</SelectLabel>
                        <SelectItem value="13:00:00">13:00</SelectItem>
                        <SelectItem value="13:30:00">13:30</SelectItem>
                        <SelectItem value="14:00:00">14:00</SelectItem>
                        <SelectItem value="14:30:00">14:30</SelectItem>
                        <SelectItem value="15:00:00">15:00</SelectItem>
                        <SelectItem value="15:30:00">15:30</SelectItem>
                        <SelectItem value="16:00:00">16:00</SelectItem>
                        <SelectItem value="16:30:00">16:30</SelectItem>
                        <SelectItem value="17:00:00">17:00</SelectItem>
                        <SelectItem value="17:30:00">17:30</SelectItem>
                        <SelectItem value="18:00:00">18:00</SelectItem>
                        <SelectItem value="18:30:00">18:30</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Noite</SelectLabel>
                        <SelectItem value="19:00:00">19:00</SelectItem>
                        <SelectItem value="19:30:00">19:30</SelectItem>
                        <SelectItem value="20:00:00">20:00</SelectItem>
                        <SelectItem value="20:30:00">20:30</SelectItem>
                        <SelectItem value="21:00:00">21:00</SelectItem>
                        <SelectItem value="21:30:00">21:30</SelectItem>
                        <SelectItem value="22:00:00">22:00</SelectItem>
                        <SelectItem value="22:30:00">22:30</SelectItem>
                        <SelectItem value="23:00:00">23:00</SelectItem>
                        <SelectItem value="23:30:00">23:30</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="availableToTime"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Horário final de disponibilidade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Manhã</SelectLabel>
                        <SelectItem value="05:00:00">05:00</SelectItem>
                        <SelectItem value="05:30:00">05:30</SelectItem>
                        <SelectItem value="06:00:00">06:00</SelectItem>
                        <SelectItem value="06:30:00">06:30</SelectItem>
                        <SelectItem value="07:00:00">07:00</SelectItem>
                        <SelectItem value="07:30:00">07:30</SelectItem>
                        <SelectItem value="08:00:00">08:00</SelectItem>
                        <SelectItem value="08:30:00">08:30</SelectItem>
                        <SelectItem value="09:00:00">09:00</SelectItem>
                        <SelectItem value="09:30:00">09:30</SelectItem>
                        <SelectItem value="10:00:00">10:00</SelectItem>
                        <SelectItem value="10:30:00">10:30</SelectItem>
                        <SelectItem value="11:00:00">11:00</SelectItem>
                        <SelectItem value="11:30:00">11:30</SelectItem>
                        <SelectItem value="12:00:00">12:00</SelectItem>
                        <SelectItem value="12:30:00">12:30</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Tarde</SelectLabel>
                        <SelectItem value="13:00:00">13:00</SelectItem>
                        <SelectItem value="13:30:00">13:30</SelectItem>
                        <SelectItem value="14:00:00">14:00</SelectItem>
                        <SelectItem value="14:30:00">14:30</SelectItem>
                        <SelectItem value="15:00:00">15:00</SelectItem>
                        <SelectItem value="15:30:00">15:30</SelectItem>
                        <SelectItem value="16:00:00">16:00</SelectItem>
                        <SelectItem value="16:30:00">16:30</SelectItem>
                        <SelectItem value="17:00:00">17:00</SelectItem>
                        <SelectItem value="17:30:00">17:30</SelectItem>
                        <SelectItem value="18:00:00">18:00</SelectItem>
                        <SelectItem value="18:30:00">18:30</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Noite</SelectLabel>
                        <SelectItem value="19:00:00">19:00</SelectItem>
                        <SelectItem value="19:30:00">19:30</SelectItem>
                        <SelectItem value="20:00:00">20:00</SelectItem>
                        <SelectItem value="20:30:00">20:30</SelectItem>
                        <SelectItem value="21:00:00">21:00</SelectItem>
                        <SelectItem value="21:30:00">21:30</SelectItem>
                        <SelectItem value="22:00:00">22:00</SelectItem>
                        <SelectItem value="22:30:00">22:30</SelectItem>
                        <SelectItem value="23:00:00">23:00</SelectItem>
                        <SelectItem value="23:30:00">23:30</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose ref={closeDialogButtonRef} />
            <Button disabled={upsertDoctorAction.isPending}>
              {upsertDoctorAction.isPending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Salvar</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
