import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/useToast'
import { insertRecord } from '@/lib/supabase/rpc-helpers'

interface EmployeeFormProps {
  employeeId?: string | null
  onSuccess?: () => void
  onCancel?: () => void
}

interface Department {
  id: string
  name: string
}

interface EmployeeFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  national_id: string
  employee_number: string
  employment_type: string
  employment_status: string
  hire_date: string
  department_id: string
  job_title: string
  base_salary: string
  address_line_1: string
  city: string
  country: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relationship: string
  bank_name: string
  bank_account_number: string
}

export function EmployeeForm({ employeeId, onSuccess, onCancel }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [formData, setFormData] = useState<EmployeeFormData>({
    // Personal
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    national_id: '',
    
    // Employment
    employee_number: '',
    employment_type: 'full_time',
    employment_status: 'active',
    hire_date: new Date().toISOString().split('T')[0],
    department_id: '',
    job_title: '',
    base_salary: '',
    
    // Address
    address_line_1: '',
    city: 'Lusaka',
    country: 'Zambia',
    
    // Emergency
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    
    // Bank
    bank_name: '',
    bank_account_number: '',
  })

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchMetadata()
    if (employeeId) {
      fetchEmployee()
    }
  }, [employeeId])

  async function fetchMetadata() {
    try {
      const [deptRes] = await Promise.all([
        supabase.from('departments').select('id, name').eq('is_active', true).order('name'),
      ])

      if (deptRes.data) setDepartments(deptRes.data)
    } catch (error) {
      console.error('Error fetching metadata:', error)
    }
  }

  async function fetchEmployee() {
    if (!employeeId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single()

      if (error) throw error
      if (data) {
        const emp = data as any
        setFormData({
          first_name: emp.first_name || '',
          last_name: emp.last_name || '',
          email: emp.email || '',
          phone: emp.phone || '',
          date_of_birth: emp.date_of_birth || '',
          gender: emp.gender || '',
          national_id: emp.national_id || '',
          employee_number: emp.employee_number || '',
          employment_type: emp.employment_type || 'full_time',
          employment_status: emp.employment_status || 'active',
          hire_date: emp.hire_date || '',
          department_id: emp.department_id || '',
          job_title: emp.job_title || '',
          base_salary: emp.base_salary?.toString() || '',
          address_line_1: emp.address_line_1 || '',
          city: emp.city || 'Lusaka',
          country: emp.country || 'Zambia',
          emergency_contact_name: emp.emergency_contact_name || '',
          emergency_contact_phone: emp.emergency_contact_phone || '',
          emergency_contact_relationship: emp.emergency_contact_relationship || '',
          bank_name: emp.bank_name || '',
          bank_account_number: emp.bank_account_number || '',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch employee details',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const sanitizeData = (data: any) => {
    const sanitized = { ...data }
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === '') {
        sanitized[key] = null
      }
    })
    return sanitized
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const sanitizedData = sanitizeData(formData)
      const payload: any = {
        ...sanitizedData,
        base_salary: sanitizedData.base_salary ? parseFloat(sanitizedData.base_salary.toString()) : null
      }

      let error
      if (employeeId) {
        const { error: updateError } = await (supabase
          .from('employees') as any)
          .update(payload)
          .eq('id', employeeId)
        error = updateError
      } else {
        const { error: insertError } = await (insertRecord as any)(
          supabase,
          'employees',
          payload
        )
        error = insertError
      }

      if (error) throw error

      toast({
        title: 'Success',
        description: `Employee ${employeeId ? 'updated' : 'created'} successfully`,
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${employeeId ? 'update' : 'create'} employee`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="bank">Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="employment" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee_number">Employee ID *</Label>
              <Input
                id="employee_number"
                value={formData.employee_number}
                onChange={(e) => handleChange('employee_number', e.target.value)}
                placeholder="EMP001"
                required
              />
            </div>
            <div>
              <Label htmlFor="hire_date">Hire Date *</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => handleChange('hire_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="employment_type">Employment Type</Label>
              <Select value={formData.employment_type} onValueChange={(v) => handleChange('employment_type', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="base_salary">Base Salary</Label>
              <Input
                id="base_salary"
                type="number"
                value={formData.base_salary}
                onChange={(e) => handleChange('base_salary', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="department_id">Department</Label>
              <Select value={formData.department_id} onValueChange={(v) => handleChange('department_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => handleChange('job_title', e.target.value)}
                placeholder="e.g. Software Engineer, Account Manager"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="address_line_1">Address</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) => handleChange('address_line_1', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={formData.bank_name}
                onChange={(e) => handleChange('bank_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bank_account_number">Account Number</Label>
              <Input
                id="bank_account_number"
                value={formData.bank_account_number}
                onChange={(e) => handleChange('bank_account_number', e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (employeeId ? 'Updating...' : 'Creating...') : (employeeId ? 'Update Employee' : 'Create Employee')}
        </Button>
      </div>
    </form>
  )
}