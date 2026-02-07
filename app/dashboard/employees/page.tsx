'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/useToast'
import { 
  UserPlus, 
  Search, 
  Download,
  MoreVertical
} from 'lucide-react'
import { formatDate, getInitials } from '@/lib/utils'

interface Employee {
  id: string
  employee_number: string
  first_name: string
  last_name: string
  email: string
  avatar_url: string | null
  employment_status: string
  employment_type: string
  hire_date: string
  departments: { name: string } | null
  job_titles: { title: string } | null
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [searchQuery, statusFilter, employees])

  async function fetchEmployees() {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          departments (name),
          job_titles (title)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmployees(data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch employees',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  function filterEmployees() {
    let filtered = employees

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(emp =>
        emp.first_name.toLowerCase().includes(query) ||
        emp.last_name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.employee_number.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(emp => emp.employment_status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }

  function getStatusBadge(status: string) {
    const colors: Record<string, string> = {
      active: 'success',
      on_leave: 'warning',
      suspended: 'outline',
      terminated: 'destructive',
      pending: 'secondary',
    }
    return <Badge variant={colors[status] as any}>{status.replace('_', ' ').toUpperCase()}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-600 mt-1">Manage your workforce ({employees.length} total)</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />Export
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />Add Employee
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <label htmlFor="status-filter" className="sr-only">
              Filter by employment status
            </label>
            <select
              id="status-filter"
              aria-label="Filter by employment status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{filteredEmployees.length} Employees</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No employees found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Employee</th>
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Job Title</th>
                    <th className="text-left py-3 px-4">Department</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Hire Date</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={emp.avatar_url || undefined} />
                            <AvatarFallback>{getInitials(emp.first_name, emp.last_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{emp.first_name} {emp.last_name}</p>
                            <p className="text-sm text-gray-500">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">{emp.employee_number}</td>
                      <td className="py-3 px-4 text-sm">{emp.job_titles?.title || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{emp.departments?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{getStatusBadge(emp.employment_status)}</td>
                      <td className="py-3 px-4 text-sm">{formatDate(emp.hire_date)}</td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded" title="More actions">
                          <MoreVertical className="h-4 w-4" />
                        </button>
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