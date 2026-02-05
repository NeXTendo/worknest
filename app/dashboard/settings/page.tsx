'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage system preferences and configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" placeholder="Enter company name" />
          </div>
          <div>
            <Label htmlFor="company-email">Contact Email</Label>
            <Input id="company-email" type="email" placeholder="contact@company.com" />
          </div>
          <div>
            <Label htmlFor="company-phone">Phone Number</Label>
            <Input id="company-phone" placeholder="+260 XXX XXX XXX" />
          </div>
          <Button><Save className="mr-2 h-4 w-4" />Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex gap-2 items-center">
              <Input id="primary-color" type="color" value="#14B8A6" className="w-20" />
              <span className="text-sm text-gray-600">#14B8A6 (WorkNest Teal)</span>
            </div>
          </div>
          <div>
            <Label htmlFor="logo">Company Logo</Label>
            <Input id="logo" type="file" accept="image/*" />
          </div>
          <Button><Save className="mr-2 h-4 w-4" />Update Branding</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-600">Version</dt>
              <dd className="font-medium">1.0.0</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Build</dt>
              <dd className="font-medium">Production</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Database</dt>
              <dd className="font-medium">PostgreSQL (Supabase)</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Framework</dt>
              <dd className="font-medium">Next.js 14</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
