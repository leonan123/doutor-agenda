import 'dayjs/locale/pt-br'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import type { doctorsTable } from '@/_db/schema'

type GetAvailabilityParams = typeof doctorsTable.$inferSelect

dayjs.extend(utc)
dayjs.locale('pt-br')

function parseTime(timeString: string) {
  const [hours = '0', minutes = '0', seconds = '0'] = timeString.split(':')
  return {
    hours: Number(hours),
    minutes: Number(minutes),
    seconds: Number(seconds),
  }
}

function createDayWithTime(weekday: number, timeString: string) {
  const { hours, minutes, seconds } = parseTime(timeString)

  return dayjs()
    .utc()
    .day(weekday)
    .set('hour', hours)
    .set('minute', minutes)
    .set('second', seconds)
    .local()
}

export function getAvailability(doctor: GetAvailabilityParams) {
  const from = createDayWithTime(
    doctor.availableFromWeekday,
    doctor.availableFromTime,
  )

  const to = createDayWithTime(
    doctor.availableToWeekday,
    doctor.availableToTime,
  )

  return { from, to }
}
