'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus, Clock, DollarSign, Calendar } from 'lucide-react'

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="justify-start">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
        <Button variant="outline" className="justify-start">
          <Clock className="h-4 w-4 mr-2" />
          Log Attendance
        </Button>
        <Button variant="outline" className="justify-start">
          <DollarSign className="h-4 w-4 mr-2" />
          Process Payroll
        </Button>
        <Button variant="outline" className="justify-start">
          <Calendar className="h-4 w-4 mr-2" />
          New Leave Request
        </Button>
      </CardContent>
    </Card>
  )
}
