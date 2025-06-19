'use server'

import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/_db'
import { doctorsTable } from '@/_db/schema'
import { actionClient } from '@/_lib/next-safe-action'

import { authMiddleware } from '../_middlewares/auth'

export const deleteDoctor = actionClient
  .use(authMiddleware)
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ ctx: { session }, parsedInput }) => {
    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.id),
    })

    if (!doctor || doctor.clinicId !== session.user.clinic.id) {
      throw new Error('Médico não encontrado.')
    }

    await db.delete(doctorsTable).where(eq(doctorsTable.id, parsedInput.id))
  })
