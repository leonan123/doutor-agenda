'use server'

import { db } from '@/_db'
import { doctorsTable } from '@/_db/schema'
import { convertTimeToUTC } from '@/_helpers/convert-time-to-utc'
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

    const availableFromTimeUTC = convertTimeToUTC(parsedInput.availableFromTime)
    const availableToTimeUTC = convertTimeToUTC(parsedInput.availableToTime)

    await db
      .insert(doctorsTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
        avatarImageUrl: '',
        availableFromTime: availableFromTimeUTC.format('HH:mm:ss'),
        availableToTime: availableToTimeUTC.format('HH:mm:ss'),
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
          availableFromTime: availableFromTimeUTC.format('HH:mm:ss'),
          availableToTime: availableToTimeUTC.format('HH:mm:ss'),
        },
      })
  })
