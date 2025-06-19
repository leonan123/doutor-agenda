'use server'

import { revalidatePath } from 'next/cache'

import { db } from '@/_db'
import { appointmentsTable } from '@/_db/schema'
import { actionClient } from '@/_lib/next-safe-action'

import { authMiddleware } from '../_middlewares/auth'
import { upsertAppointmentSchema } from './schema'

export const upsertAppointment = actionClient
  .use(authMiddleware)
  .inputSchema(upsertAppointmentSchema)
  .action(async ({ ctx: { session }, parsedInput }) => {
    if (!session.user.clinic.id) {
      throw new Error('Clinic not found.')
    }

    await db
      .insert(appointmentsTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: appointmentsTable.id,
        set: {
          ...parsedInput,
        },
      })

    revalidatePath('/appointments')
  })
