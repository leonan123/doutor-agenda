'use server'

import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/_db'
import { appointmentsTable } from '@/_db/schema'
import { actionClient } from '@/_lib/next-safe-action'

import { authMiddleware } from '../_middlewares/auth'

export const deleteAppointment = actionClient
  .use(authMiddleware)
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ ctx: { session }, parsedInput }) => {
    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, parsedInput.id),
    })

    if (!appointment || appointment.clinicId !== session.user.clinic.id) {
      throw new Error('Agendamento não encontrado.')
    }

    await db
      .delete(appointmentsTable)
      .where(eq(appointmentsTable.id, parsedInput.id))
  })
