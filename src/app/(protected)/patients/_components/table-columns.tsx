'use client'
import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/_components/ui/badge'
import type { patientsTable } from '@/_db/schema'

import { TableActions } from './table-actions'

export type Patient = typeof patientsTable.$inferSelect

export const columns: ColumnDef<Patient>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'EMAIL',
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: 'TELEFONE',
    cell: ({ row }) => {
      const phone = row.original.phoneNumber
      const formatted =
        phone?.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') || ''

      return formatted
    },
  },
  {
    id: 'sex',
    accessorKey: 'sex',
    header: 'SEXO',
    cell: ({ row }) => {
      const patient = row.original

      const sexMap = {
        male: {
          label: 'Masculino',
          color: 'text-primary border-primary bg-transparent',
        },
        female: {
          label: 'Feminino',
          color: 'text-rose-400 border-rose-400 bg-transparent',
        },
      }

      return (
        <Badge className={sexMap[patient.sex].color} variant="outline">
          {sexMap[patient.sex].label}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    accessorKey: '',
    cell: ({ row }) => <TableActions patient={row.original} />,
  },
]
