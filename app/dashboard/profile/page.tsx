'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { ProfileView } from '@/components/profile/profile-view'
import { Employee } from '@/lib/database.types'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { fetchRecord, fetchWithJoins } from '@/lib/supabase/rpc-helpers'

export default function MyProfilePage() {
  const { user } = useAuthStore()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchMyProfile()
    }
  }, [user])

  async function fetchMyProfile() {
    try {
      setLoading(true)
      
      let employeeId = user?.employee_id
      
      if (!employeeId && user?.id) {
         // 1. Try to fetch from profiles table
         const { data: profile, error: profileError } = await fetchRecord(
           supabase,
           'profiles',
           user.id
         )
         
         if (profileError) throw profileError
         employeeId = profile?.employee_id || undefined

         // 2. If still no employeeId, try to find by email and autolink
         if (!employeeId && user.email) {
            const { data: employeesByEmail } = await supabase
              .from('employees')
              .select('id')
              .eq('email', user.email)
              .maybeSingle()

            if (employeesByEmail) {
              const { updateRecord } = await import('@/lib/supabase/rpc-helpers')
              
              const foundEmployeeId = (employeesByEmail as any).id
              
              // Auto-link: Update profile and employee record
              await Promise.all([
                updateRecord(supabase, 'profiles', user.id, { employee_id: foundEmployeeId }),
                updateRecord(supabase, 'employees', foundEmployeeId, { user_id: user.id })
              ])
              
              employeeId = foundEmployeeId
            }
         }
      }

      if (!employeeId) {
        setError('Employee record not found. Please contact HR.')
        return
      }

      const { data: employeeData, error: employeeError } = await fetchWithJoins(
        supabase,
        'employees',
        `
          *,
          job_titles ( title ),
          departments ( name )
        `,
        { id: employeeId }
      )

      if (employeeError) throw employeeError
      
      if (!employeeData || employeeData.length === 0) {
        setError('Employee details not found.')
        return
      }

      setEmployee(employeeData[0] as any)
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
        <h3 className="text-lg font-semibold text-slate-900">Error Loading Profile</h3>
        <p className="text-slate-600">{error}</p>
      </div>
    )
  }

  // extract joined data safely
  const jobTitle = (employee as any)?.job_titles?.title
  const department = (employee as any)?.departments?.name

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your personal information</p>
        </div>

        {employee && (
            <ProfileView 
                employee={employee} 
                currentUserRole={user?.role} 
                onUpdate={fetchMyProfile}
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
