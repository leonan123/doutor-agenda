import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function convertTimeToUTC(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number)

  return dayjs()
    .set('hour', hours)
    .set('minute', minutes)
    .set('second', seconds)
    .utc()
}
