'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function PayrollTable({ payroll }: { payroll: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Basic</TableHead>
          <TableHead>Net Pay</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payroll.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.employees?.first_name}</TableCell>
            <TableCell>{p.pay_period}</TableCell>
            <TableCell>K{p.basic_salary}</TableCell>
            <TableCell>K{p.net_pay}</TableCell>
            <TableCell>{p.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
