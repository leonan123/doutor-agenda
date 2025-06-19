'use server'

import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/_db'
import { patientsTable } from '@/_db/schema'
import { actionClient } from '@/_lib/next-safe-action'

import { authMiddleware } from '../_middlewares/auth'

export const deletePatient = actionClient
  .use(authMiddleware)
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ ctx: { session }, parsedInput }) => {
    const patient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, parsedInput.id),
    })

    if (!patient || patient.clinicId !== session.user.clinic.id) {
      throw new Error('Paciente não encontrado.')
    }

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id))
  })
