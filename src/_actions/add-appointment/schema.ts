import { z } from 'zod'

export const addAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  date: z.date(),
  appointmentPriceInCents: z.number().min(1),
})
