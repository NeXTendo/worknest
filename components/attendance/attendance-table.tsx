'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface AttendanceTableProps {
  attendance: any[]
}

export function AttendanceTable({ attendance }: AttendanceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Check In</TableHead>
          <TableHead>Check Out</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendance.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.employees?.first_name} {record.employees?.last_name}</TableCell>
            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
            <TableCell>{record.check_in || '-'}</TableCell>
            <TableCell>{record.check_out || '-'}</TableCell>
            <TableCell>{record.work_hours || 0}h</TableCell>
            <TableCell>
              <Badge>{record.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
