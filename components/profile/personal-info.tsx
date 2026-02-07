'use client'

import { useState } from 'react'
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

interface PersonalInfoProps {
  employee: Employee
  isEditable: boolean
  onUpdate: () => void
}

export function PersonalInfo({ employee, isEditable, onUpdate }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date_of_birth: employee.date_of_birth || '',
    gender: employee.gender || '',
    nationality: employee.nationality || '',
    national_id: employee.national_id || '',
    passport_number: employee.passport_number || '',
    address_line_1: employee.address_line_1 || '',
    address_line_2: employee.address_line_2 || '',
    city: employee.city || '',
    state_province: employee.state_province || '',
    postal_code: employee.postal_code || '',
    country: employee.country || '',
    phone: employee.phone || '',
    alternate_phone: employee.alternate_phone || '',
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
        title: 'Profile Updated',
        description: 'Personal information has been saved successfully.',
      })
      
      setIsEditing(false)
      onUpdate()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
        date_of_birth: employee.date_of_birth || '',
        gender: employee.gender || '',
        nationality: employee.nationality || '',
        national_id: employee.national_id || '',
        passport_number: employee.passport_number || '',
        address_line_1: employee.address_line_1 || '',
        address_line_2: employee.address_line_2 || '',
        city: employee.city || '',
        state_province: employee.state_province || '',
        postal_code: employee.postal_code || '',
        country: employee.country || '',
        phone: employee.phone || '',
        alternate_phone: employee.alternate_phone || '',
    })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic personal details and identification</CardDescription>
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
                <Label>Date of Birth</Label>
                {isEditing ? (
                    <Input type="date" value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
                ) : (
                    <div className="text-sm font-medium">{employee.date_of_birth ? format(new Date(employee.date_of_birth), 'PPP') : '-'}</div>
                )}
            </div>
            <div className="space-y-2">
                <Label>Gender</Label>
                {isEditing ? (
                    <Input value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} placeholder="e.g. Male, Female, Other" />
                ) : (
                    <div className="text-sm font-medium capitalize">{employee.gender || '-'}</div>
                )}
            </div>
             <div className="space-y-2">
                <Label>Phone Number</Label>
                {isEditing ? (
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                ) : (
                    <div className="text-sm font-medium">{employee.phone || '-'}</div>
                )}
            </div>
             <div className="space-y-2">
                <Label>Alternate Phone</Label>
                {isEditing ? (
                    <Input value={formData.alternate_phone} onChange={e => setFormData({...formData, alternate_phone: e.target.value})} />
                ) : (
                    <div className="text-sm font-medium">{employee.alternate_phone || '-'}</div>
                )}
            </div>
        </div>
        
        <div className="border-t pt-4">
            <h4 className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Address</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label>Address Line 1</Label>
                    {isEditing ? (
                        <Input value={formData.address_line_1} onChange={e => setFormData({...formData, address_line_1: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.address_line_1 || '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>City</Label>
                    {isEditing ? (
                        <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.city || '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>State / Province</Label>
                    {isEditing ? (
                        <Input value={formData.state_province} onChange={e => setFormData({...formData, state_province: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.state_province || '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>Postal Code</Label>
                    {isEditing ? (
                        <Input value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.postal_code || '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>Country</Label>
                    {isEditing ? (
                        <Input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.country || '-'}</div>
                    )}
                </div>
            </div>
        </div>

        <div className="border-t pt-4">
            <h4 className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Identification</h4>
             <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Nationality</Label>
                    {isEditing ? (
                        <Input value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.nationality || '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>National ID</Label>
                    {isEditing ? (
                        <Input value={formData.national_id} onChange={e => setFormData({...formData, national_id: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.national_id || '-'}</div>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label>Passport Number</Label>
                    {isEditing ? (
                        <Input value={formData.passport_number} onChange={e => setFormData({...formData, passport_number: e.target.value})} />
                    ) : (
                        <div className="text-sm font-medium">{employee.passport_number || '-'}</div>
                    )}
                </div>
             </div>
        </div>
      </CardContent>
    </Card>
  )
}
