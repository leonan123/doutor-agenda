'use client'

import { type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

import { type appointmentsTable } from '@/_db/schema'
import { formatCurrencyInCents } from '@/_helpers/currency'

import { DeleteAppointmentButton } from './delete-appointment-button'

export const columns: ColumnDef<typeof appointmentsTable.$inferSelect>[] = [
  {
    accessorKey: 'patient.name',
    header: 'Paciente',
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      return dayjs(row.original.date).format('DD/MM/YYYY HH:mm')
    },
  },
  {
    accessorKey: 'doctor.name',
    header: 'Médico',
  },
  {
    accessorKey: 'doctor.specialty',
    header: 'Especialidade',
  },
  {
    accessorKey: 'appointmentPriceInCents',
    header: 'Valor',
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {formatCurrencyInCents(row.original.appointmentPriceInCents)}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <DeleteAppointmentButton appointment={row.original} />
    },
  },
]
