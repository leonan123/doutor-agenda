import { z } from 'zod'

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, 'O nome é obrigatório'),
    specialty: z.string().trim().min(1, 'A especialidade é obrigatória'),
    appointmentPriceInCents: z
      .number()
      .min(1, 'O preço da consulta é obrigatório'),
    availableFromWeekday: z.number().min(0).max(6),
    availableToWeekday: z.number().min(0).max(6),
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

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>
