'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus } from 'lucide-react'

export default function LeavePage() {
  const leaveRequests = [
    { id: 1, employee: 'John Doe', type: 'Annual', from: '2024-03-15', to: '2024-03-20', days: 5, status: 'pending' },
    { id: 2, employee: 'Jane Smith', type: 'Sick', from: '2024-03-10', to: '2024-03-12', days: 2, status: 'approved' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage leave requests and approvals</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />New Request</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold mt-2 text-worknest-amber">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Approved</div>
            <div className="text-2xl font-bold mt-2 text-worknest-emerald">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Rejected</div>
            <div className="text-2xl font-bold mt-2 text-worknest-rose">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">This Month</div>
            <div className="text-2xl font-bold mt-2">12</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{req.employee}</p>
                  <p className="text-sm text-gray-500">{req.type} Leave - {req.days} days</p>
                  <p className="text-xs text-gray-400 mt-1">{req.from} to {req.to}</p>
                </div>
                <Badge variant={req.status === 'pending' ? 'warning' : 'success'}>
                  {req.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
