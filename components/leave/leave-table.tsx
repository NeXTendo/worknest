'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

interface LeaveTableProps {
  requests: any[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function LeaveTable({ requests, onApprove, onReject }: LeaveTableProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Days</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req.id}>
            <TableCell>{req.employees?.first_name} {req.employees?.last_name}</TableCell>
            <TableCell className="capitalize">{req.leave_type.replace('_', ' ')}</TableCell>
            <TableCell>
              {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
            </TableCell>
            <TableCell>{req.days_requested}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
            </TableCell>
            <TableCell>
              {req.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onApprove?.(req.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onReject?.(req.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
