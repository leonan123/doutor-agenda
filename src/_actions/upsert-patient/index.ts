'use server'

import { revalidatePath } from 'next/cache'

import { db } from '@/_db'
import { patientsTable } from '@/_db/schema'
import { actionClient } from '@/_lib/next-safe-action'

import { authMiddleware } from '../_middlewares/auth'
import { upsertPatientSchema } from './schema'

export const upsertPatient = actionClient
  .use(authMiddleware)
  .inputSchema(upsertPatientSchema)
  .action(async ({ ctx: { session }, parsedInput }) => {
    if (!session.user.clinic.id) {
      throw new Error('Clinic not found.')
    }

    await db
      .insert(patientsTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: patientsTable.id,
        set: {
          ...parsedInput,
        },
      })

    revalidatePath('/patients')
  })
