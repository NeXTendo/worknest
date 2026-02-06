'use client'

import Calendar from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface DateRangePickerProps {
  from?: Date
  to?: Date
  onSelect: (from?: Date, to?: Date) => void
}

export function DateRangePicker({ from, to, onSelect }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from ? (
            to ? (
              <>
                {format(from, 'LLL dd, y')} - {format(to, 'LLL dd, y')}
              </>
            ) : (
              format(from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={from}
          selected={{ from, to }}
          onSelect={(range: any) => onSelect(range?.from, range?.to)}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}