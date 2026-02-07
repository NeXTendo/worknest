'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Company } from '@/lib/database.types'
import { useCompaniesStore } from '@/store/useCompaniesStore'
import { useToast } from '@/hooks/useToast'
import { Building2, Globe, Phone, Mail, Palette, Info } from 'lucide-react'

interface CompanyFormProps {
  company?: Company
  onSuccess?: () => void
}

export function CompanyForm({ company, onSuccess }: CompanyFormProps) {
  const { addCompany, updateCompany } = useCompaniesStore()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    industry: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    country: 'Zambia',
    primary_color: '#0f172a',
    secondary_color: '#334155',
    accent_color: '#3b82f6',
    is_active: true,
    ...company
  })

  useEffect(() => {
    if (company) {
      setFormData(company)
    }
  }, [company])

  const sanitizeData = (data: Partial<Company>) => {
    const sanitized = { ...data }
    Object.keys(sanitized).forEach((key) => {
      const k = key as keyof Company
      if (sanitized[k] === '') {
        // @ts-ignore
        sanitized[k] = null
      }
    })
    return sanitized
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const sanitizedData = sanitizeData(formData)

    try {
      let success = false
      if (company) {
        success = await updateCompany(company.id, sanitizedData)
      } else {
        success = await addCompany(sanitizedData)
      }

      if (success) {
        toast({ 
          title: 'Success', 
          description: `Company ${company ? 'updated' : 'created'} successfully` 
        })
        if (onSuccess) onSuccess()
      } else {
        throw new Error('Operation failed')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save company',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto px-1 scrollbar-hide">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-semibold border-b pb-2">
          <Info className="h-4 w-4" />
          General Information
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="name"
                className="pl-10"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="TechOhns Inc."
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry || ''}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="Technology"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country || ''}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="Zambia"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Lusaka"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Business Way, City, Country"
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-semibold border-b pb-2">
          <Globe className="h-4 w-4" />
          Contact & Online Presence
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Official Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@company.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="phone"
                className="pl-10"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="website"
              className="pl-10"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://company.com"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-semibold border-b pb-2">
          <Palette className="h-4 w-4" />
          Branding Colors
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                type="color"
                className="p-1 h-10 w-12 cursor-pointer"
                value={formData.primary_color || '#0f172a'}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
              />
              <Input
                value={formData.primary_color || ''}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary_color">Secondary</Label>
            <div className="flex gap-2">
              <Input
                id="secondary_color"
                type="color"
                className="p-1 h-10 w-12 cursor-pointer"
                value={formData.secondary_color || '#334155'}
                onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
              />
              <Input
                value={formData.secondary_color || ''}
                onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accent_color">Accent</Label>
            <div className="flex gap-2">
              <Input
                id="accent_color"
                type="color"
                className="p-1 h-10 w-12 cursor-pointer"
                value={formData.accent_color || '#3b82f6'}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
              />
              <Input
                value={formData.accent_color || ''}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="submit" disabled={loading} className="w-full h-11">
          {loading ? 'Saving...' : company ? 'Update Company' : 'Register Company'}
        </Button>
      </div>
    </form>
  )
}
