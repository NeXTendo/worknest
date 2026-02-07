'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserPlus, Shield } from 'lucide-react'

export default function UsersPage() {
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@worknest.app', role: 'main_admin', status: 'active' },
    { id: 2, name: 'HR Manager', email: 'hr@worknest.app', role: 'hr_admin', status: 'active' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-1">Manage system users and permissions</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-sm text-slate-600 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <Badge className="text-xs">{user.role.replace('_', ' ').toUpperCase()}</Badge>
                  <Badge variant="success" className="text-xs">{user.status.toUpperCase()}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
