'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { ProfileView } from '@/components/profile/profile-view'
import { Employee } from '@/lib/database.types'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UserProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (user && id) {
      fetchEmployeeProfile(id as string)
    }
  }, [user, id])

  async function fetchEmployeeProfile(targetUserId: string) {
    try {
      setLoading(true)
      
      // 1. Fetch Target Employee
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          job_titles ( title ),
          departments ( name )
        `)
        .eq('id', targetUserId) 
        .single()

      if (error) throw error

      if (!data) {
        setError('Employee not found.')
        return
      }

      // 2. Permission Check
      const isSuperAdmin = user?.role === 'super_admin'
      // @ts-ignore
      const isSameCompany = user?.company_id === data.company_id
      
      if (!isSuperAdmin && !isSameCompany) {
        setError('You do not have permission to view this profile.')
        return
      }

      setEmployee(data as any)
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile data.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <ProfileSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-semibold text-slate-900">Access Denied</h3>
        <p className="text-slate-600">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  // extract joined data safely
  const jobTitle = (employee as any)?.job_titles?.title
  const department = (employee as any)?.departments?.name

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Employee Profile</h1>
                <p className="text-slate-600 mt-1">View and manage employee details</p>
            </div>
        </div>

        {employee && (
            <ProfileView 
                employee={employee} 
                currentUserRole={user?.role} 
                onUpdate={() => fetchEmployeeProfile(id as string)}
                jobTitle={jobTitle}
                department={department}
            />
        )}
    </div>
  )
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
             <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
             <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
             <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-10 bg-slate-200 rounded animate-pulse" />)}
             </div>
             <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
        </div>
    )
}
