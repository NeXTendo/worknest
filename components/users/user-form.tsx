'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Profile, ProfileUpdate, UserRole } from '@/lib/database.types'
import { useUserStore } from '@/store/useUserStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/useToast'

interface UserFormProps {
  user?: Profile
  onSuccess?: () => void
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const { updateUser, addUser } = useUserStore()
  const { user: currentUser } = useAuthStore()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Profile>>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'employee',
    is_active: true,
    ...user
  })

  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (user) {
        // Update existing profile
        const { error } = await updateUser(user.id, formData as ProfileUpdate)
        if (error) throw error
        toast({ title: 'Success', description: 'User updated successfully' })
      } else {
        // Typically adding a user requires creating an auth user first.
        // For now, if we don't have a createUser server action, we inform the user.
        toast({ 
          title: 'Not Implemented', 
          description: 'User creation is currently handled via Employee creation.',
          variant: 'destructive'
        })
      }
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name || ''}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            placeholder="John"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name || ''}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john.doe@example.com"
          required
          disabled={!!user} // Email usually shouldn't change for auth reasons
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main_admin">Main Admin</SelectItem>
            <SelectItem value="hr_admin">HR Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            {currentUser?.role === 'super_admin' && (
              <SelectItem value="super_admin">Super Admin</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}
