'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function LeavePage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    thisMonth: 0
  })
  
  const { user } = useAuthStore()
  const supabase = createClient()
  const isEmployee = user?.role === 'employee' || user?.role === 'manager'

  useEffect(() => {
    if (user) fetchLeaveData()
  }, [user])

  async function fetchLeaveData() {
    try {
      setLoading(true)
      
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          employees (
            first_name,
            last_name,
            department:departments(name)
          )
        `)
        .order('created_at', { ascending: false })

      // If employee, filter by their specific employee_id
      if (isEmployee) {
        // Get employee record first
        const { data: profileData } = await supabase
          .from('profiles')
          .select('employee_id')
          .eq('id', user!.id)
          .single()
        
        const profile = profileData as { employee_id: string } | null
          
        if (profile?.employee_id) {
          query = query.eq('employee_id', profile.employee_id)
        }
      }

      const { data, error } = await query

      if (error) throw error
      
      // Explicitly cast the data to avoid 'never' or 'any' issues
      const typedData = (data || []) as unknown as any[] 

      setRequests(typedData)

      // Calculate stats
      const pending = typedData.filter(r => r.status === 'pending').length || 0
      const approved = typedData.filter(r => r.status === 'approved').length || 0
      const rejected = typedData.filter(r => r.status === 'rejected').length || 0
      
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const thisMonth = typedData.filter(r => r.created_at >= startOfMonth).length || 0

      setStats({ pending, approved, rejected, thisMonth })

    } catch (error) {
      console.error('Error fetching leave:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
      approved: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
      rejected: 'bg-rose-100 text-rose-800 hover:bg-rose-100',
      cancelled: 'bg-slate-100 text-slate-800 hover:bg-slate-100',
    }
    return (
      <Badge className={`${styles[status]} border-none`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) return <LeaveSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEmployee ? 'My Leave' : 'Leave Management'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isEmployee ? 'View and manage your leave requests' : 'Manage employee leave requests and approvals'}
          </p>
        </div>
        <Button size="sm" className="w-full sm:w-auto bg-worknest-teal hover:bg-teal-700">
          <Plus className="mr-2 h-4 w-4" />New Request
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatusCard title="Pending" value={stats.pending} icon={<Clock className="h-4 w-4 text-amber-600" />} color="text-amber-600" />
        <StatusCard title="Approved" value={stats.approved} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} color="text-emerald-600" />
        <StatusCard title="Rejected" value={stats.rejected} icon={<XCircle className="h-4 w-4 text-rose-600" />} color="text-rose-600" />
        <StatusCard title="This Month" value={stats.thisMonth} icon={<Calendar className="h-4 w-4 text-slate-600" />} color="text-slate-900" />
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>
            {isEmployee ? 'My Requests' : 'All Requests'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No leave requests found.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">
                        {req.employees?.first_name} {req.employees?.last_name}
                      </span>
                      {!isEmployee && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {req.employees?.department?.name || 'No Dept'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium text-slate-800">{req.leave_type.replace('_', ' ')}</span>
                      <span className="mx-2">•</span>
                      <span>{req.days_requested} day{req.days_requested !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(req.start_date)} - {formatDate(req.end_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(req.status)}
                    {!isEmployee && (
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-worknest-teal">
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusCard({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500 font-medium">{title}</div>
          {icon}
        </div>
        <div className={`text-2xl font-bold mt-2 ${color}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

function LeaveSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
