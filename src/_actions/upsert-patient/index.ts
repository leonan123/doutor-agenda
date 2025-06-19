'use server'

import { eq } from 'drizzle-orm'

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

    if (parsedInput.id) {
      const [patient] = await db
        .update(patientsTable)
        .set({
          name: parsedInput.name,
          email: parsedInput.email,
          phoneNumber: parsedInput.phoneNumber,
          sex: parsedInput.sex,
        })
        .where(eq(patientsTable.id, parsedInput.id))
        .returning()

      return patient
    }

    const [patient] = await db
      .insert(patientsTable)
      .values({
        clinicId: session.user.clinic.id,
        name: parsedInput.name,
        email: parsedInput.email,
        phoneNumber: parsedInput.phoneNumber,
        sex: parsedInput.sex,
      })
      .returning()

    return patient
  })
