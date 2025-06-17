'use server'

import { db } from '@/_db'
import { clinicsTable, usersToClinicsTable } from '@/_db/schema'

import { protectedAction } from '../_middlewares/with-auth'

export const createClinic = protectedAction(async (session, name: string) => {
  const [clinic] = await db
    .insert(clinicsTable)
    .values({
      name,
    })
    .returning()

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  })
})
