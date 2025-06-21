'use client'

import 'date-fns/locale/pt-BR'

import dayjs from 'dayjs'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { parseAsIsoDate, useQueryState } from 'nuqs'
import type { ComponentProps } from 'react'
import * as React from 'react'
import { DateRange } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'

import { Button } from '@/_components/ui/button'
import { Calendar } from '@/_components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components/ui/popover'
import { cn } from '@/_lib/utils'

dayjs.locale('pt-br')

export function DatePickerWithRange({ className }: ComponentProps<'div'>) {
  const [from, setFrom] = useQueryState(
    'from',
    parseAsIsoDate.withDefault(dayjs().toDate()),
  )

  const [to, setTo] = useQueryState(
    'to',
    parseAsIsoDate.withDefault(dayjs().add(1, 'month').toDate()),
  )

  const [date, setDate] = React.useState<DateRange | undefined>({
    from,
    to,
  })

  function handleDateChange(dateRange: DateRange | undefined) {
    if (dateRange?.from) {
      setFrom(dateRange.from)
    }

    if (dateRange?.to) {
      setTo(dateRange.to)
    }

    setDate(dateRange)
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'bg-card w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon />

            <div className="flex-1">
              {date?.from ? (
                date.to ? (
                  <>
                    {dayjs(date.from).format('DD [de] MMM, YYYY')} -{' '}
                    {dayjs(date.to).format('DD [de] MMM, YYYY')}
                  </>
                ) : (
                  dayjs(date.from).format('DD [de] MMM, YYYY')
                )
              ) : (
                <span>Selecione uma data</span>
              )}
            </div>

            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
