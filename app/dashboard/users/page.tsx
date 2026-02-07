'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Filter, Building2, Search, AlertCircle, Shield } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { useAuthStore } from '@/store/useAuthStore'
import { UserCard } from '@/components/users/user-card'
import { UserForm } from '@/components/users/user-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Profile } from '@/lib/database.types'
import { createClient } from '@/lib/supabase/client'
import { fetchRecords } from '@/lib/supabase/rpc-helpers'

export default function UsersPage() {
  const { user: currentUser } = useAuthStore()
  const { users, isLoading, fetchUsers, deleteUser, setUserStatus } = useUserStore()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Profile | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [companies, setCompanies] = useState<{ id: string, name: string }[]>([])
  const [isCmpLoading, setIsCmpLoading] = useState(false)

  const isSuperAdmin = currentUser?.role === 'super_admin'
  const isEmployee = currentUser?.role === 'employee'

  useEffect(() => {
    if (currentUser && !isEmployee) {
      // If super admin, fetch with company filter if selected
      const cmpId = isSuperAdmin && selectedCompany !== 'all' ? selectedCompany : (isSuperAdmin ? undefined : currentUser.company_id)
      fetchUsers(cmpId)
    }

    if (isSuperAdmin) {
      loadCompanies()
    }
  }, [currentUser, selectedCompany, isEmployee])

  const loadCompanies = async () => {
    setIsCmpLoading(true)
    const supabase = createClient()
    const { data } = await fetchRecords(supabase, 'companies', {
      orderBy: { column: 'name', ascending: true }
    })
    if (data) setCompanies(data as any)
    setIsCmpLoading(false)
  }

  const handleEdit = (user: Profile) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(id)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await setUserStatus(id, !currentStatus)
  }

  const filteredUsers = users.filter(user => 
    user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.employee_id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isEmployee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-slate-300" />
        <h1 className="text-xl font-semibold text-slate-600">Access Restricted</h1>
        <p className="text-slate-500 text-center max-w-xs">
          Only administrators have permission to view and manage system users.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-1">Manage system users and permissions</p>
        </div>
        <div className="flex gap-2">
          {isSuperAdmin && (
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[180px]">
                <Building2 className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={() => { setSelectedUser(undefined); setIsDialogOpen(true); }}>
            <UserPlus className="mr-2 h-4 w-4" />Add User
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Shield className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-900">No users found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <UserForm 
            user={selectedUser} 
            onSuccess={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
