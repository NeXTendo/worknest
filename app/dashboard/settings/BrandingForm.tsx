'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateCompanyBranding } from './actions'
import { useToast } from '@/hooks/useToast'
import { Building2, Loader2, Upload } from 'lucide-react'
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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      if (name === 'primary_color') root.style.setProperty('--brand-primary', value)
      if (name === 'secondary_color') root.style.setProperty('--brand-secondary', value)
      if (name === 'accent_color') root.style.setProperty('--brand-accent', value)
    }
  }

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-gray-50/50 border-b">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-worknest-teal" />
          Branding & Identity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form action={handleSubmit} className="space-y-8">
          <input type="hidden" name="existing_logo" value={company.logo_url || ''} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="text-sm font-semibold">Primary Theme Color</Label>
              <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border">
                <Input 
                  id="primary-color" 
                  name="primary_color" 
                  type="color" 
                  defaultValue={company.primary_color || '#14B8A6'} 
                  className="w-12 h-12 p-1 border-2 rounded-md cursor-pointer" 
                  onChange={handleColorChange}
                  disabled={readonly}
                />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-700">Main Color</p>
                  <p className="text-[10px] text-gray-400">Sidebar & main actions</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color" className="text-sm font-semibold">Secondary Color</Label>
              <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border">
                <Input 
                  id="secondary-color" 
                  name="secondary_color" 
                  type="color" 
                  defaultValue={company.secondary_color || '#0F172A'} 
                  className="w-12 h-12 p-1 border-2 rounded-md cursor-pointer" 
                  onChange={handleColorChange}
                  disabled={readonly}
                />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-700">Secondary</p>
                  <p className="text-[10px] text-gray-400">Headings & contrast</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color" className="text-sm font-semibold">Accent Color</Label>
              <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border">
                <Input 
                  id="accent-color" 
                  name="accent_color" 
                  type="color" 
                  defaultValue={company.accent_color || '#F59E0B'} 
                  className="w-12 h-12 p-1 border-2 rounded-md cursor-pointer" 
                  onChange={handleColorChange}
                  disabled={readonly}
                />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-700">Accent</p>
                  <p className="text-[10px] text-gray-400">Highlights & badges</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label htmlFor="logo" className="text-sm font-semibold">Company Logo</Label>
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50/50 p-6 rounded-xl border-2 border-dashed border-gray-200">
              <div className="h-32 w-32 rounded-xl bg-white shadow-sm ring-1 ring-gray-200 flex items-center justify-center overflow-hidden relative group">
                {preview ? (
                  <Image 
                    src={preview} 
                    alt="Logo preview" 
                    fill 
                    className="object-contain p-4"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-gray-300" />
                )}
              </div>
              <div className="flex-1 w-full space-y-3 text-center sm:text-left">
                <div className="flex flex-col gap-2">
                  <Input 
                    id="logo" 
                    name="logo" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoChange}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-worknest-teal file:text-white hover:file:bg-worknest-teal/90"
                    disabled={readonly}
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1 justify-center sm:justify-start">
                    <Upload className="h-3 w-3" />
                    Recommended: Transparent PNG, 400x400px, Max 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!readonly && (
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="min-w-[150px] bg-worknest-teal hover:bg-worknest-teal/90">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Branding
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
