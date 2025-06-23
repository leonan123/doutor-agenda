import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { customSession } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'

import { db } from '@/_db'
import * as schema from '@/_db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const userWithClinic = await db.query.usersToClinicsTable.findFirst({
        where: eq(schema.usersToClinicsTable.userId, user.id),
        with: {
          clinic: {
            columns: {
              name: true,
            },
          },
          user: {
            columns: {
              plan: true,
            },
          },
        },
      })

      return {
        user: {
          ...user,
          plan: userWithClinic?.user?.plan,
          clinic: {
            id: userWithClinic?.clinicId,
            name: userWithClinic?.clinic!.name,
          },
        },
        session,
      }
    }),
  ],
  user: {
    modelName: 'usersTable',
    additionalFields: {
      stripeCustomerId: {
        type: 'string',
        fieldName: 'stripeCustomerId',
        required: false,
      },
      stripeSubscriptionId: {
        type: 'string',
        fieldName: 'stripeSubscriptionId',
        required: false,
      },
      plan: {
        type: 'string',
        fieldName: 'plan',
        required: false,
      },
    },
  },
  session: {
    modelName: 'sessionsTable',
  },
  account: {
    modelName: 'accountsTable',
  },
  verification: {
    modelName: 'verificationsTable',
  },
  emailAndPassword: {
    enabled: true,
  },
})
