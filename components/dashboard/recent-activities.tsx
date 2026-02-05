'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RecentActivities() {
  const activities = [
    { title: 'New employee added', description: 'John Doe joined the team', time: '2h ago' },
    { title: 'Leave approved', description: 'Annual leave for Jane Smith', time: '5h ago' },
    { title: 'Payroll processed', description: 'Monthly payroll completed', time: '1d ago' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-2 w-2 rounded-full bg-teal-500 mt-2" />
              <div>
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
