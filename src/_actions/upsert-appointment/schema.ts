import { z } from 'zod'

export const upsertAppointmentSchema = z.object({
  id: z.string().uuid().optional(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  date: z.date(),
  appointmentPriceInCents: z.number().min(1),
})
