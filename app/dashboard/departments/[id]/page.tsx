'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Building2, 
  Users, 
  ChevronLeft, 
  Settings, 
  DollarSign,
  Briefcase,
  ExternalLink
} from 'lucide-react'
import { DepartmentMembers } from '@/components/departments/department-members'
import { formatCurrency } from '@/lib/utils'
import { useDepartmentStore } from '@/store/useDepartmentStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DepartmentForm } from '@/components/departments/department-form'
import { Badge } from '@/components/ui/badge'

export default function DepartmentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [department, setDepartment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const supabase = createClient()
  const { fetchDepartments } = useDepartmentStore()

  useEffect(() => {
    fetchDepartmentDetails()
  }, [id])

  async function fetchDepartmentDetails() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          employees!manager_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setDepartment(data)
    } catch (error) {
      console.error('Error fetching department details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    fetchDepartmentDetails()
    fetchDepartments() // Refresh the store list if needed
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[400px] col-span-2" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Department not found</h2>
        <Button variant="link" onClick={() => router.back()}>Go back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-xl">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{department.name}</h1>
          <p className="text-slate-600">Department Overview</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button onClick={() => setIsEditDialogOpen(true)} variant="outline" className="shadow-sm">
            <Settings className="mr-2 h-4 w-4" /> Edit Details
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-worknest-teal/20 to-teal-500/20" />
            <CardContent className="relative pt-0">
              <div className="absolute -top-12 left-6 h-24 w-24 rounded-2xl bg-white p-2 shadow-lg">
                <div className="h-full w-full rounded-xl bg-worknest-teal/10 flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-worknest-teal" />
                </div>
              </div>
              <div className="pt-16 pb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">About {department.name}</h2>
                <p className="text-slate-600 leading-relaxed">
                  {department.description || 'No description provided for this department.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Department Members</CardTitle>
              <Badge variant="outline" className="text-worknest-teal border-worknest-teal/20">
                {department.employee_count} total
              </Badge>
            </CardHeader>
            <CardContent>
              <DepartmentMembers departmentId={department.id} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm bg-slate-50/50">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Department Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Annual Budget</p>
                  <p className="text-lg font-bold text-slate-900">
                    {department.budget ? formatCurrency(department.budget) : 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Department Manager</p>
                  {department.employees ? (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-bold text-slate-900">
                        {department.employees.first_name} {department.employees.last_name}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No manager assigned</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Team Size</p>
                  <p className="text-lg font-bold text-slate-900">{department.employee_count} Employees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-worknest-teal" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" /> View Analytics
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-worknest-teal" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" /> Export Member List
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit {department.name}</DialogTitle>
          </DialogHeader>
          <DepartmentForm 
            departmentId={department.id}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
