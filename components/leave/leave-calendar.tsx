'use client'

import Calendar from '@/components/ui/calendar'

export function LeaveCalendar({ leaveRequests }: { leaveRequests: any[] }) {
  const leaveDates = leaveRequests
    .filter(r => r.status === 'approved')
    .flatMap(r => {
      const dates = []
      const start = new Date(r.start_date)
      const end = new Date(r.end_date)
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d))
      }
      return dates
    })

  return (
    <Calendar
      mode="multiple"
      selected={leaveDates}
      className="rounded-md border"
    />
  )
}
