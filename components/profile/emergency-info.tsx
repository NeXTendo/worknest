'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Employee } from '@/lib/database.types'
import { Pencil, Save, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateRecord } from '@/lib/supabase/rpc-helpers'
import { useToast } from '@/hooks/useToast'

interface EmergencyInfoProps {
  employee: Employee
  isEditable: boolean
  onUpdate: () => void
}

export function EmergencyInfo({ employee, isEditable, onUpdate }: EmergencyInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    emergency_contact_name: employee.emergency_contact_name || '',
    emergency_contact_relationship: employee.emergency_contact_relationship || '',
    emergency_contact_phone: employee.emergency_contact_phone || '',
    emergency_contact_address: employee.emergency_contact_address || '',
  })
  
  const supabase = createClient()
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      setLoading(true)
      const { error } = await updateRecord(
        supabase,
        'employees',
        employee.id,
        formData
      )
      
      if (error) throw error

      toast({
        title: 'Emergency Contact Updated',
        description: 'Information has been saved successfully.',
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
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_relationship: employee.emergency_contact_relationship || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        emergency_contact_address: employee.emergency_contact_address || '',
    })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Primary contact for emergency situations</CardDescription>
        </div>
        {isEditable && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Info
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
                <Label>Contact Name</Label>
                {isEditing ? (
                    <Input value={formData.emergency_contact_name} onChange={e => setFormData({...formData, emergency_contact_name: e.target.value})} placeholder="Full Name" />
                ) : (
                    <div className="text-sm font-medium">{employee.emergency_contact_name || '-'}</div>
                )}
            </div>
            <div className="space-y-2">
                <Label>Relationship</Label>
                {isEditing ? (
                    <Input value={formData.emergency_contact_relationship} onChange={e => setFormData({...formData, emergency_contact_relationship: e.target.value})} placeholder="e.g. Spouse, Parent" />
                ) : (
                    <div className="text-sm font-medium">{employee.emergency_contact_relationship || '-'}</div>
                )}
            </div>
             <div className="space-y-2">
                <Label>Phone Number</Label>
                {isEditing ? (
                    <Input value={formData.emergency_contact_phone} onChange={e => setFormData({...formData, emergency_contact_phone: e.target.value})} placeholder="+1 234 567 8900" />
                ) : (
                    <div className="text-sm font-medium">{employee.emergency_contact_phone || '-'}</div>
                )}
            </div>
             <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                {isEditing ? (
                    <Textarea value={formData.emergency_contact_address} onChange={e => setFormData({...formData, emergency_contact_address: e.target.value})} placeholder="Full Address" className="min-h-[80px]" />
                ) : (
                    <div className="text-sm font-medium whitespace-pre-wrap">{employee.emergency_contact_address || '-'}</div>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
