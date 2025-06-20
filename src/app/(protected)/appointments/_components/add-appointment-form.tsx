'use client'

import 'dayjs/locale/pt-br'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { CalendarIcon, Loader2Icon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import { z } from 'zod'

import { addAppointment } from '@/_actions/add-appointment'
import { Button } from '@/_components/ui/button'
import { Calendar } from '@/_components/ui/calendar'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select'
import type { doctorsTable, patientsTable } from '@/_db/schema'

dayjs.locale('pt-br')

const addAppointmentFormSchema = z
  .object({
    patientId: z.string().uuid({ message: 'Selecione um paciente' }),
    doctorId: z.string().uuid({ message: 'Selecione um médico' }),
    date: z.date({
      required_error: 'Selecione uma data',
      invalid_type_error: 'Data inválida',
    }),
    time: z
      .string({
        required_error: 'Selecione um horário',
      })
      .min(1, 'Selecione um horário'),
    appointmentPriceInCents: z
      .number({
        required_error: 'O valor da consulta é obrigatório',
      })
      .min(1, 'O valor da consulta deve ser maior que 0'),
  })
  .refine(
    (data) => {
      const appointmentDate = dayjs(data.date)
        .hour(parseInt(data.time.split(':')[0]))
        .minute(parseInt(data.time.split(':')[1]))

      return appointmentDate.isAfter(dayjs())
    },
    {
      message: 'A data e hora do agendamento devem ser futuras',
      path: ['date'],
    },
  )

type AddAppointmentFormData = z.infer<typeof addAppointmentFormSchema>

interface AddAppointmentFormProps {
  patients: (typeof patientsTable.$inferSelect)[]
  doctors: (typeof doctorsTable.$inferSelect)[]
}

export function AddAppointmentForm({
  patients,
  doctors,
}: AddAppointmentFormProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<
    typeof doctorsTable.$inferSelect | null
  >(null)
  const closeDialogButtonRef = useRef<HTMLButtonElement>(null)

  const form = useForm<AddAppointmentFormData>({
    resolver: zodResolver(addAppointmentFormSchema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      date: undefined,
      time: '',
      appointmentPriceInCents: 0,
    },
  })

  const addAppointmentAction = useAction(addAppointment, {
    onSuccess: () => {
      toast.success('Agendamento criado com sucesso')
      closeDialogButtonRef.current?.click()
    },
    onError: () => {
      toast.error('Erro ao criar agendamento')
    },
  })

  const doctorId = form.watch('doctorId')
  const patientId = form.watch('patientId')
  const date = form.watch('date')

  async function onSubmit(data: AddAppointmentFormData) {
    const appointmentDate = dayjs(data.date)
      .hour(parseInt(data.time.split(':')[0]))
      .minute(parseInt(data.time.split(':')[1]))
      .toDate()

    addAppointmentAction.execute({
      ...data,
      date: appointmentDate,
    })
  }

  function handleDialogClose() {
    form.reset()
    setSelectedDoctor(null)
  }

  useEffect(() => {
    if (doctorId) {
      const doctor = doctors.find((d) => d.id === doctorId)
      setSelectedDoctor(doctor ?? null)
      if (doctor) {
        form.setValue('appointmentPriceInCents', doctor.appointmentPriceInCents)
      }
    } else {
      setSelectedDoctor(null)
      form.setValue('appointmentPriceInCents', 0)
    }
  }, [doctorId, doctors, form])

  return (
    <DialogContent onCloseAutoFocus={handleDialogClose}>
      <DialogHeader>
        <DialogTitle>Novo agendamento</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para criar um novo agendamento.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPriceInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <NumericFormat
                  value={field.value / 100}
                  onValueChange={(values) => {
                    field.onChange(
                      values.floatValue ? values.floatValue * 100 : 0,
                    )
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  prefix="R$ "
                  customInput={Input}
                  disabled={!selectedDoctor}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal ${!field.value && 'text-muted-foreground'}`}
                          disabled={!patientId || !doctorId}
                        >
                          {field.value ? (
                            dayjs(field.value).format('DD [de] MMMM [de] YYYY')
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < dayjs().startOf('day').toDate()
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!date || !patientId || !doctorId}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedDoctor && (
                        <>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogClose ref={closeDialogButtonRef} className="hidden" />

          <Button
            type="submit"
            className="w-full"
            disabled={addAppointmentAction.isExecuting}
          >
            {addAppointmentAction.isExecuting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Criando agendamento...
              </>
            ) : (
              'Criar agendamento'
            )}
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}
