'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/useToast'
import { useDepartmentStore } from '@/store/useDepartmentStore'
import { DepartmentInsert, DepartmentUpdate } from '@/lib/database.types'

interface DepartmentFormProps {
  departmentId?: string | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function DepartmentForm({ departmentId, onSuccess, onCancel }: DepartmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<{ id: string; first_name: string; last_name: string }[]>([])
  const [formData, setFormData] = useState<DepartmentInsert>({
    name: '',
    description: '',
    manager_id: null,
    budget: null,
    is_active: true,
  })

  const supabase = createClient()
  const { toast } = useToast()
  const { addDepartment, updateDepartment } = useDepartmentStore()

  useEffect(() => {
    fetchEmployees()
    if (departmentId) {
      fetchDepartment()
    }
  }, [departmentId])

  async function fetchEmployees() {
    const { data } = await supabase
      .from('employees')
      .select('id, first_name, last_name')
      .eq('is_active', true)
      .order('first_name')
    if (data) setEmployees(data)
  }

  async function fetchDepartment() {
    if (!departmentId) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('id', departmentId)
        .single()

      if (error) throw error
      if (data) {
        const dept = data as any
        setFormData({
          name: dept.name,
          description: dept.description || '',
          manager_id: dept.manager_id,
          budget: dept.budget,
          is_active: dept.is_active,
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch department details',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
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
      let result
      if (departmentId) {
        result = await updateDepartment(departmentId, sanitizedData as DepartmentUpdate)
      } else {
        result = await addDepartment(sanitizedData)
      }

      if (result.error) throw result.error

      toast({
        title: 'Success',
        description: `Department ${departmentId ? 'updated' : 'created'} successfully`,
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${departmentId ? 'update' : 'create'} department`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Engineering, Sales, Human Resources"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Briefly describe the department's role..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manager_id">Department Manager</Label>
            <Select 
              value={formData.manager_id || 'none'} 
              onValueChange={(v) => setFormData({ ...formData, manager_id: v === 'none' ? null : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Manager</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Annual Budget</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget || ''}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">Active Department</Label>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} className="brand-bg hover:brand-bg">
          {loading ? (departmentId ? 'Updating...' : 'Creating...') : (departmentId ? 'Update Department' : 'Create Department')}
        </Button>
      </div>
    </form>
  )
}
