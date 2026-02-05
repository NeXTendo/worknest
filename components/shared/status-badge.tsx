'use client'

import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: string
  type?: 'employment' | 'leave' | 'payroll' | 'attendance'
}

export function StatusBadge({ status, type = 'employment' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    const styles: Record<string, Record<string, string>> = {
      employment: {
        active: 'bg-green-100 text-green-800',
        on_leave: 'bg-yellow-100 text-yellow-800',
        suspended: 'bg-red-100 text-red-800',
        terminated: 'bg-gray-100 text-gray-800',
        pending: 'bg-blue-100 text-blue-800',
      },
      leave: {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
      },
      payroll: {
        draft: 'bg-gray-100 text-gray-800',
        processing: 'bg-blue-100 text-blue-800',
        processed: 'bg-green-100 text-green-800',
        paid: 'bg-teal-100 text-teal-800',
        failed: 'bg-red-100 text-red-800',
      },
      attendance: {
        present: 'bg-green-100 text-green-800',
        absent: 'bg-red-100 text-red-800',
        late: 'bg-yellow-100 text-yellow-800',
        half_day: 'bg-orange-100 text-orange-800',
        on_leave: 'bg-blue-100 text-blue-800',
      },
    }

    return styles[type]?.[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Badge className={getStatusStyles()} variant="secondary">
      {status.replace('_', ' ')}
    </Badge>
  )
}