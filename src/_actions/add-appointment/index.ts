'use server'

import { revalidatePath } from 'next/cache'

import { db } from '@/_db'
import { appointmentsTable } from '@/_db/schema'
import { actionClient } from '@/_lib/next-safe-action'

import { authMiddleware } from '../_middlewares/auth'
import { addAppointmentSchema } from './schema'

export const addAppointment = actionClient
  .use(authMiddleware)
  .inputSchema(addAppointmentSchema)
  .action(async ({ ctx: { session }, parsedInput }) => {
    if (!session.user.clinic.id) {
      throw new Error('Clinic not found.')
    }

    await db.insert(appointmentsTable).values({
      ...parsedInput,
      clinicId: session.user.clinic.id,
    })

    revalidatePath('/appointments')
  })
