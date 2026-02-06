'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateCompanyDetails } from './actions'
import { useToast } from '@/hooks/useToast'
import { Loader2 } from 'lucide-react'
import { Company } from '@/lib/database.types'

export function CompanyDetailsForm({ company, readonly = false }: { company: Company; readonly?: boolean }) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    if (readonly) return
    setLoading(true)
    try {
      const result = await updateCompanyDetails(formData)
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      } else {
        toast({
          title: "Success",
          description: "Company details updated successfully",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input 
              id="company-name" 
              name="name" 
              placeholder="Enter company name" 
              defaultValue={company.name} 
              required
              disabled={readonly}
            />
          </div>
          <div>
            <Label htmlFor="company-email">Contact Email</Label>
            <Input 
              id="company-email" 
              name="email" 
              type="email" 
              placeholder="contact@company.com" 
              defaultValue={company.email || ''} 
              disabled={readonly}
            />
          </div>
          <div>
            <Label htmlFor="company-phone">Phone Number</Label>
            <Input 
              id="company-phone" 
              name="phone" 
              placeholder="+260 XXX XXX XXX" 
              defaultValue={company.phone || ''} 
              disabled={readonly}
            />
          </div>
           <div>
            <Label htmlFor="company-address">Address</Label>
            <Input 
              id="company-address" 
              name="address" 
              placeholder="123 Main St, Lusaka" 
              defaultValue={company.address || ''} 
              disabled={readonly}
            />
          </div>
           <div>
            <Label htmlFor="company-website">Website</Label>
            <Input 
              id="company-website" 
              name="website" 
              placeholder="https://example.com" 
              defaultValue={company.website || ''} 
              disabled={readonly}
            />
          </div>
          {!readonly && (
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
