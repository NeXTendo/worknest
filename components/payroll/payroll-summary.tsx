'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PayrollSummary({ total }: { total: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Payroll</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">K{total.toLocaleString()}</p>
      </CardContent>
    </Card>
  )
}
