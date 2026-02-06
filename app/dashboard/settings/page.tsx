import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCompanySettings } from './actions'
import { CompanyDetailsForm } from './CompanyDetailsForm'
import { BrandingForm } from './BrandingForm'


export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const { company, isAdmin } = await getCompanySettings()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage system preferences and configuration</p>
      </div>

      <CompanyDetailsForm company={company} readonly={!isAdmin} />
      <BrandingForm company={company} readonly={!isAdmin} />

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
