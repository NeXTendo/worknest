'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateCompanyBranding } from './actions'
import { useToast } from '@/hooks/useToast'
import { Loader2, Upload } from 'lucide-react'
import { Company } from '@/lib/database.types'
import Image from 'next/image'

export function BrandingForm({ company, readonly = false }: { company: Company; readonly?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(company.logo_url)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    if (readonly) return
    setLoading(true)
    try {
      const result = await updateCompanyBranding(formData)
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      } else {
        toast({
          title: "Success",
          description: "Branding updated successfully",
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="existing_logo" value={company.logo_url || ''} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2 items-center mt-1">
                <Input 
                  id="primary-color" 
                  name="primary_color" 
                  type="color" 
                  defaultValue={company.primary_color || '#14B8A6'} 
                  className="w-20 h-10 p-1" 
                  disabled={readonly}
                />
                <span className="text-sm text-gray-600">Main theme color</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2 items-center mt-1">
                <Input 
                  id="secondary-color" 
                  name="secondary_color" 
                  type="color" 
                  defaultValue={company.secondary_color || '#0F766E'} 
                  className="w-20 h-10 p-1" 
                  disabled={readonly}
                />
                <span className="text-sm text-gray-600">Accents & highlights</span>
              </div>
            </div>

            <div>
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex gap-2 items-center mt-1">
                <Input 
                  id="accent-color" 
                  name="accent_color" 
                  type="color" 
                  defaultValue={company.accent_color || '#F59E0B'} 
                  className="w-20 h-10 p-1" 
                  disabled={readonly}
                />
                <span className="text-sm text-gray-600">Special actions</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-start gap-4">
              <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative">
                {preview ? (
                  <Image 
                    src={preview} 
                    alt="Logo preview" 
                    fill 
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="text-xs text-gray-400 text-center">No Logo</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input 
                  id="logo" 
                  name="logo" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange}
                  disabled={readonly}
                />
                <p className="text-xs text-gray-500">
                  Recommended: PNG or JPG, at least 400x400px. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          {!readonly && (
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Branding
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
