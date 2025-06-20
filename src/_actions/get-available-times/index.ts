'use server'

import dayjs from 'dayjs'
import { and, eq, gte, lte } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/_db'
import { appointmentsTable, doctorsTable } from '@/_db/schema'
import { convertTimeToUTC } from '@/_helpers/convert-time-to-utc'
import { generateTimeSlots } from '@/_helpers/generate-time-slots'
import { actionClient } from '@/_lib/next-safe-action'

import { authMiddleware } from '../_middlewares/auth'

type GetDoctorByIdResponse =
  | {
      availableFromWeekday: number
      availableToWeekday: number
      availableFromTime: string
      availableToTime: string
    }
  | undefined

async function getDoctorById(
  doctorId: string,
  clinicId: string,
): Promise<GetDoctorByIdResponse> {
  const doctor = await db.query.doctorsTable.findFirst({
    columns: {
      availableFromWeekday: true,
      availableToWeekday: true,
      availableFromTime: true,
      availableToTime: true,
    },
    where: and(
      eq(doctorsTable.id, doctorId),
      eq(doctorsTable.clinicId, clinicId),
    ),
  })

  return doctor
}

export const getAvailableTimes = actionClient
  .use(authMiddleware)
  .inputSchema(
    z.object({
      date: z.string().date(),
      doctorId: z.string(),
    }),
  )
  .action(async ({ ctx: { session }, parsedInput }) => {
    if (!session.user.clinic.id) {
      throw new Error('Clinic not found')
    }

    const doctor = await getDoctorById(
      parsedInput.doctorId,
      session.user.clinic.id,
    )

    if (!doctor) {
      throw new Error('Doctor not found')
    }

    const selectedDayOfWeek = dayjs(parsedInput.date).day()

    const isDoctorAvailable =
      selectedDayOfWeek >= doctor.availableFromWeekday &&
      selectedDayOfWeek <= doctor.availableToWeekday

    if (!isDoctorAvailable) {
      return []
    }

    const startOfDay = dayjs(parsedInput.date).startOf('day')
    const endOfDay = dayjs(parsedInput.date).endOf('day')

    const doctorAppointmentsOnSelectedDay =
      await db.query.appointmentsTable.findMany({
        columns: {
          date: true,
        },
        where: and(
          eq(appointmentsTable.doctorId, parsedInput.doctorId),
          gte(appointmentsTable.date, startOfDay.toDate()),
          lte(appointmentsTable.date, endOfDay.toDate()),
        ),
      })

    const timeSlots = generateTimeSlots()

    const doctorAvailableFromTime = convertTimeToUTC(doctor.availableFromTime)
      .local()
      .format('HH:mm:ss')
    const doctorAvailableToTime = convertTimeToUTC(doctor.availableToTime)
      .local()
      .format('HH:mm:ss')

    const doctorTimeSlots = timeSlots.filter((timeSlot) => {
      const time = convertTimeToUTC(timeSlot).format('HH:mm:ss')
      return time >= doctorAvailableFromTime && time <= doctorAvailableToTime
    })

    const isAvailableTimeSlot = (timeSlot: string) => {
      return !doctorAppointmentsOnSelectedDay.some((appointment) => {
        const appointmentTime = dayjs(appointment.date).format('HH:mm:ss')
        return appointmentTime === timeSlot
      })
    }

    return doctorTimeSlots.map((timeSlot) => {
      return {
        value: timeSlot,
        isAvailable: isAvailableTimeSlot(timeSlot),
        label: timeSlot.substring(0, 5), // Format to HH:mm
      }
    })
  })
