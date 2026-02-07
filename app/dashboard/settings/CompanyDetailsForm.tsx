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
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-gray-50/50 border-b">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-worknest-teal" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-sm font-semibold">Legal Company Name</Label>
              <Input 
                id="company-name" 
                name="name" 
                placeholder="WorkNest Ltd" 
                defaultValue={company.name} 
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                required
                disabled={readonly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email" className="text-sm font-semibold">Business Email</Label>
              <Input 
                id="company-email" 
                name="email" 
                type="email" 
                placeholder="contact@worknest.com" 
                defaultValue={company.email || ''} 
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                disabled={readonly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone" className="text-sm font-semibold">Support Phone</Label>
              <Input 
                id="company-phone" 
                name="phone" 
                placeholder="+260 970 000 000" 
                defaultValue={company.phone || ''} 
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                disabled={readonly}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="company-website" className="text-sm font-semibold">Web Domain</Label>
              <Input 
                id="company-website" 
                name="website" 
                placeholder="https://worknest.com" 
                defaultValue={company.website || ''} 
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                disabled={readonly}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company-address" className="text-sm font-semibold">Headquarters Address</Label>
              <Input 
                id="company-address" 
                name="address" 
                placeholder="Street Address, City, Country" 
                defaultValue={company.address || ''} 
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                disabled={readonly}
              />
            </div>
          </div>
          {!readonly && (
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading} className="min-w-[150px] bg-worknest-teal hover:bg-worknest-teal/90">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Details
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
