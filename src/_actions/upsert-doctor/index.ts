'use server'

import { db } from '@/_db'
import { doctorsTable } from '@/_db/schema'
import { actionClient } from '@/_lib/next-safe-action'

import { authMiddleware } from '../_middlewares/auth'
import { upsertDoctorSchema } from './schema'

export const upsertDoctor = actionClient
  .use(authMiddleware)
  .inputSchema(upsertDoctorSchema)
  .action(async ({ ctx: { session }, parsedInput }) => {
    if (!session.user.clinic.id) {
      throw new Error('Clinic not found.')
    }

    await db
      .insert(doctorsTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
        avatarImageUrl: '',
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
        },
      })
  })
