'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/useToast'
import { 
  UserPlus, 
  Search, 
  Download
} from 'lucide-react'
import { EmployeeTable } from '@/components/employees/employee-table'
import { EmployeeFilters } from '@/components/employees/employee-filters'
import { EmployeeDrawer } from '@/components/employees/employee-drawer'
import { Skeleton } from '@/components/ui/skeleton'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  
  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [searchQuery, statusFilter, typeFilter, employees])

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

    if (typeFilter !== 'all') {
      filtered = filtered.filter(emp => emp.employment_type === typeFilter)
    }

    setFilteredEmployees(filtered)
  }

  const handleAddEmployee = () => {
    setSelectedEmployeeId(null)
    setIsDrawerOpen(true)
  }

  const handleViewEmployee = (id: string) => {
    setSelectedEmployeeId(id)
    setIsDrawerOpen(true)
  }

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployeeId(employee.id)
    setIsDrawerOpen(true)
  }

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      })
      fetchEmployees()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete employee',
        variant: 'destructive',
      })
    }
  }

  const handleExport = () => {
    const headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Status', 'Type', 'Hire Date']
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => [
        emp.employee_number,
        emp.first_name,
        emp.last_name,
        emp.email,
        emp.employment_status,
        emp.employment_type,
        emp.hire_date
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full mb-4 last:mb-0" />)}
          </CardContent>
        </Card>
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
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />Export
          </Button>
          <Button size="sm" className="w-full sm:w-auto" onClick={handleAddEmployee}>
            <UserPlus className="mr-2 h-4 w-4" />Add Employee
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <EmployeeFilters 
              employmentType={typeFilter}
              employmentStatus={statusFilter}
              onTypeChange={setTypeFilter}
              onStatusChange={setStatusFilter}
            />
          </div>
        </CardContent>
      </Card>

      <EmployeeTable 
        employees={filteredEmployees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        onView={handleViewEmployee}
      />

      <EmployeeDrawer 
        employeeId={selectedEmployeeId}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          fetchEmployees()
        }}
      />
    </div>
  )
}