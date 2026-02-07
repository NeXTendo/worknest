import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Employee } from '@/lib/database.types'
import { Pencil, Save, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateRecord } from '@/lib/supabase/rpc-helpers'
import { useToast } from '@/hooks/useToast'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EmploymentInfoProps {
  employee: Employee
  isEditable: boolean
  onUpdate: () => void
  jobTitleName?: string
  departmentName?: string
}

export function EmploymentInfo({ employee, isEditable, onUpdate, jobTitleName, departmentName }: EmploymentInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [availableJobTitles, setAvailableJobTitles] = useState<{id: string, title: string}[]>([])
  const [availableDepartments, setAvailableDepartments] = useState<{id: string, name: string}[]>([])
  
  const [formData, setFormData] = useState({
    employee_number: employee.employee_number || '',
    hire_date: employee.hire_date || '',
    employment_type: employee.employment_type || '',
    employment_status: employee.employment_status || '',
    contract_start_date: employee.contract_start_date || '',
    contract_end_date: employee.contract_end_date || '',
    probation_end_date: employee.probation_end_date || '',
    base_salary: employee.base_salary?.toString() || '',
    currency: employee.currency || 'USD',
    pay_frequency: employee.pay_frequency || '',
    bank_name: employee.bank_name || '',
    bank_account_number: employee.bank_account_number || '',
    bank_account_name: employee.bank_account_name || '',
    tax_number: employee.tax_number || '',
    job_title_id: employee.job_title_id || '',
    department_id: employee.department_id || '',
  })
  
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    if (isEditing) {
      fetchOptions()
    }
  }, [isEditing])

  async function fetchOptions() {
    // Fetch departments and job titles for the company
    const { data: depts } = await supabase.from('departments').select('id, name').eq('is_active', true).eq('company_id', employee.company_id)
    const { data: titles } = await supabase.from('job_titles').select('id, title').eq('is_active', true).eq('company_id', employee.company_id)
    
    if (depts) setAvailableDepartments(depts)
    if (titles) setAvailableJobTitles(titles)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      // Explicitly construct update object to bypass type issues with 'never' if inference fails
      const updates: any = {
        ...formData,
        base_salary: formData.base_salary ? parseFloat(formData.base_salary) : null,
      }
      
      const { error } = await updateRecord(
        supabase,
        'employees',
        employee.id,
        updates
      )
      
      if (error) throw error

      toast({
        title: 'Employment Details Updated',
        description: 'Employment information has been saved successfully.',
      })
      
      setIsEditing(false)
      onUpdate()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update details',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
        employee_number: employee.employee_number || '',
        hire_date: employee.hire_date || '',
        employment_type: employee.employment_type || '',
        employment_status: employee.employment_status || '',
        contract_start_date: employee.contract_start_date || '',
        contract_end_date: employee.contract_end_date || '',
        probation_end_date: employee.probation_end_date || '',
        base_salary: employee.base_salary?.toString() || '',
        currency: employee.currency || 'USD',
        pay_frequency: employee.pay_frequency || '',
        bank_name: employee.bank_name || '',
        bank_account_number: employee.bank_account_number || '',
        bank_account_name: employee.bank_account_name || '',
        tax_number: employee.tax_number || '',
        job_title_id: employee.job_title_id || '',
        department_id: employee.department_id || '',
    })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Employment Details</CardTitle>
          <CardDescription>Job related information and compensation</CardDescription>
        </div>
        {isEditable && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
        {isEditing && (
            <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel} disabled={loading}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
            </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Employee ID</Label>
                {isEditing ? (
                    <Input value={formData.employee_number} onChange={e => setFormData({...formData, employee_number: e.target.value})} />
                ) : (
                    <div className="text-sm font-medium">{employee.employee_number || '-'}</div>
                )}
            </div>
            <div className="space-y-2">
                <Label>Hire Date</Label>
                {isEditing ? (
                    <Input type="date" value={formData.hire_date} onChange={e => setFormData({...formData, hire_date: e.target.value})} />
                ) : (
                    <div className="text-sm font-medium">{employee.hire_date ? format(new Date(employee.hire_date), 'PPP') : '-'}</div>
                )}
            </div>
             <div className="space-y-2">
                <Label>Job Title</Label>
                {isEditing ? (
                    <Select value={formData.job_title_id} onValueChange={val => setFormData({...formData, job_title_id: val})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Job Title" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableJobTitles.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                ) : (
                    <div className="text-sm font-medium">{jobTitleName || '-'}</div>
                )}
            </div>
             <div className="space-y-2">
                <Label>Department</Label>
                {isEditing ? (
                    <Select value={formData.department_id} onValueChange={val => setFormData({...formData, department_id: val})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableDepartments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                ) : (
                    <div className="text-sm font-medium">{departmentName || '-'}</div>
                )}
            </div>
             <div className="space-y-2">
                <Label>Employment Type</Label>
                {isEditing ? (
                    <Input value={formData.employment_type} onChange={e => setFormData({...formData, employment_type: e.target.value as any})} /> 
                ) : (
                    <div className="text-sm font-medium capitalize">{employee.employment_type?.replace('_', ' ') || '-'}</div>
                )}
            </div>
             <div className="space-y-2">
                <Label>Status</Label>
                {isEditing ? (
                    <Input value={formData.employment_status} onChange={e => setFormData({...formData, employment_status: e.target.value as any})} />
                ) : (
                    <div className="text-sm font-medium capitalize">{employee.employment_status?.replace('_', ' ') || '-'}</div>
                )}
            </div>
        </div>
// ... rest of the file ...
        
        <div className="border-t pt-4">
            <h4 className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Contract Details</h4>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Contract Start</Label>
                    {isEditing ? (
                        <Input type="date" value={formData.contract_start_date} onChange={e => setFormData({...formData, contract_start_date: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.contract_start_date ? format(new Date(employee.contract_start_date), 'PPP') : '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>Contract End</Label>
                    {isEditing ? (
                        <Input type="date" value={formData.contract_end_date} onChange={e => setFormData({...formData, contract_end_date: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.contract_end_date ? format(new Date(employee.contract_end_date), 'PPP') : '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>Probation End</Label>
                    {isEditing ? (
                        <Input type="date" value={formData.probation_end_date} onChange={e => setFormData({...formData, probation_end_date: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.probation_end_date ? format(new Date(employee.probation_end_date), 'PPP') : '-'}</div>
                    )}
                </div>
            </div>
        </div>

        <div className="border-t pt-4">
            <h4 className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Compensation</h4>
             <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Base Salary</Label>
                    {isEditing ? (
                        <Input type="number" value={formData.base_salary} onChange={e => setFormData({...formData, base_salary: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.base_salary ? formatCurrency(employee.base_salary) : '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>Review Frequency</Label>
                    {isEditing ? (
                        <Input value={formData.pay_frequency} onChange={e => setFormData({...formData, pay_frequency: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium capitalize">{employee.pay_frequency || '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>Bank Name</Label>
                    {isEditing ? (
                        <Input value={formData.bank_name} onChange={e => setFormData({...formData, bank_name: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.bank_name || '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>Account Number</Label>
                    {isEditing ? (
                        <Input value={formData.bank_account_number} onChange={e => setFormData({...formData, bank_account_number: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">•••• •••• •••• {employee.bank_account_number ? employee.bank_account_number.slice(-4) : ''}</div>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Tax ID</Label>
                    {isEditing ? (
                        <Input value={formData.tax_number} onChange={e => setFormData({...formData, tax_number: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.tax_number || '-'}</div>
                    )}
                </div>
             </div>
        </div>
      </CardContent>
    </Card>
  )
}
