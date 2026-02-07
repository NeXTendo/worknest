'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Plus, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function CreateAnnouncementDialog({ onAnnouncementCreated }: { onAnnouncementCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()
  const supabase = createClient()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    target_company_id: '',
  })

  // State for companies (Super Admin only)
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (user?.role === 'super_admin' && open) {
      fetchCompanies()
    }
  }, [user?.role, open])

  // If regular admin, default company_id to their own
  useEffect(() => {
    if (user?.role !== 'super_admin' && user?.company_id) {
      setFormData(prev => ({ ...prev, target_company_id: user.company_id }))
    }
  }, [user])

  async function fetchCompanies() {
    const { data } = await supabase.from('companies').select('id, name').eq('is_active', true)
    if (data) setCompanies(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)

      const companyId = user.role === 'super_admin' ? formData.target_company_id : user.company_id

      if (!companyId) {
        toast({
          title: 'Error',
          description: 'Target company is required',
          variant: 'destructive',
        })
        return
      }

      // Explicitly typing as any to bypass TS error with insert inference
      const newAnnouncement: any = {
        company_id: companyId,
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        published_by: user.id,
        published_at: new Date().toISOString(),
        is_pinned: false
      }

      const { error } = await supabase.from('announcements').insert(newAnnouncement)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Announcement created successfully',
      })

      setOpen(false)
      setFormData({
        title: '',
        content: '',
        priority: 'normal',
        target_company_id: user.role === 'super_admin' ? '' : (user.company_id || ''),
      })
      onAnnouncementCreated()

    } catch (error: any) {
      console.error('Error creating announcement:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create announcement',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Only admins and super admins can create announcements
  if (user?.role === 'employee') return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />New Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {user?.role === 'super_admin' && (
             <div className="space-y-2">
              <Label htmlFor="company">Target Company</Label>
              <Select 
                value={formData.target_company_id} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, target_company_id: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Office Holiday Closing"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, priority: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter announcement details..."
              className="min-h-[100px]"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-worknest-teal hover:bg-worknest-teal/90">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Announcement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
