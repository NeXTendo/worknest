'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Building2, Users, DollarSign, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Department {
  id: string
  name: string
  description: string | null
  employee_count: number
  budget: number | null
  created_at: string
}

interface DepartmentEmployee {
  id: string
  employee_number: string
  first_name: string
  last_name: string
  email: string
  avatar_url: string | null
  job_titles: { title: string } | null
}

export default function DepartmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const departmentId = params.id as string
  const supabase = createClient()

  const [department, setDepartment] = useState<Department | null>(null)
  const [employees, setEmployees] = useState<DepartmentEmployee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDepartmentData()
  }, [departmentId])

  async function fetchDepartmentData() {
    try {
      setLoading(true)
      setError(null)

      // Fetch department details
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .eq('id', departmentId)
        .single()

      if (deptError) throw deptError
      setDepartment(deptData)

      // Fetch department employees
      const { data: empData, error: empError } = await supabase
        .from('employees')
        .select('id, employee_number, first_name, last_name, email, avatar_url, job_titles(title)')
        .eq('department_id', departmentId)
        .order('first_name')

      if (empError) throw empError
      setEmployees(empData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load department')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this department?')) return

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId)

      if (error) throw error
      router.push('/dashboard/departments')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete department')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-40" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  if (error || !department) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/departments"
            className="flex items-center gap-2 text-worknest-teal hover:text-worknest-teal/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Departments
          </Link>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error || 'Department not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const budgetPerEmployee = department.employee_count > 0
    ? (department.budget || 0) / department.employee_count
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/dashboard/departments"
              className="flex items-center gap-2 text-worknest-teal hover:text-worknest-teal/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Departments
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-worknest-teal/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-worknest-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{department.name}</h1>
              {department.description && (
                <p className="text-gray-600 mt-2">{department.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{department.employee_count}</div>
              <div className="h-12 w-12 rounded-lg bg-worknest-teal/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-worknest-teal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                ${(department.budget || 0).toLocaleString()}
              </div>
              <div className="h-12 w-12 rounded-lg bg-worknest-emerald/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-worknest-emerald" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Budget per Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                ${budgetPerEmployee.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="h-12 w-12 rounded-lg bg-worknest-amber/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-worknest-amber" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Information */}
      <Card>
        <CardHeader>
          <CardTitle>Department Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Department Name</label>
              <p className="text-lg mt-2">{department.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Created</label>
              <p className="text-lg mt-2">
                {new Date(department.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          {department.description && (
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{department.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employees */}
      <Card>
        <CardHeader>
          <CardTitle>Department Employees</CardTitle>
          <CardDescription>{employees.length} employees</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No employees in this department</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                      Employee
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                      Job Title
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/dashboard/employees/${emp.id}`}
                          className="font-medium text-worknest-teal hover:text-worknest-teal/80 transition-colors"
                        >
                          {emp.first_name} {emp.last_name}
                          <span className="text-xs text-gray-500 ml-2">({emp.employee_number})</span>
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{emp.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-worknest-teal/5">
                          {emp.job_titles?.title || 'N/A'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
