'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Download, Send } from 'lucide-react'

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll</h1>
          <p className="text-gray-600 mt-1">Manage salaries and payments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button><Send className="mr-2 h-4 w-4" />Process Payroll</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Total Payroll</div>
            <div className="text-2xl font-bold mt-2 text-worknest-teal">K450,000</div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Processed</div>
            <div className="text-2xl font-bold mt-2 text-worknest-emerald">124</div>
            <div className="text-xs text-gray-500 mt-1">Employees paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold mt-2 text-worknest-amber">0</div>
            <div className="text-xs text-gray-500 mt-1">Awaiting processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Average Salary</div>
            <div className="text-2xl font-bold mt-2">K3,629</div>
            <div className="text-xs text-gray-500 mt-1">Per employee</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            Payroll management interface - Select month to process payments
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
