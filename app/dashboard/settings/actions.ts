'use server'

import { createServerSupabaseClient, serverClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { updateRecord, fetchRecord } from '@/lib/supabase/rpc-helpers'
import { revalidatePath } from 'next/cache'
import { Company } from '@/lib/database.types'

export async function getCompanySettings() {
  const supabase = createServerSupabaseClient()
  
  const { user, error: userError } = await serverClient.getUser()
  if (userError || !user) throw new Error('Unauthorized')

  const { data: profile } = await fetchRecord(supabase, 'profiles', user.id)
  if (!profile || !profile.company_id) throw new Error('Profile or Company not found')

  const isAdmin = await serverClient.isAdmin(user.id) 

  // Use admin client to bypass RLS on companies table
  const { data: company, error: companyError } = await fetchRecord(adminClient.client, 'companies', profile.company_id)
  if (companyError || !company) throw new Error('Failed to fetch company settings')

  return { company: company as Company, isAdmin }
}

export async function updateCompanyDetails(formData: FormData) {
  const supabase = createServerSupabaseClient()
  
  const { user } = await serverClient.getUser()
  if (!user) return { error: 'Unauthorized' }

  const isAdmin = await serverClient.isAdmin(user.id)
  if (!isAdmin) return { error: 'Permission denied. Admin access required.' }

  const { data: profile } = await fetchRecord(supabase, 'profiles', user.id)
  if (!profile || !profile.company_id) return { error: 'Company not found' }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const website = formData.get('website') as string
  const address = formData.get('address') as string

  // Use admin client to bypass RLS and problematic RPC on companies table
  const { error } = await (adminClient.client as any)
    .from('companies')
    .update({
      name,
      email,
      phone,
      website,
      address
    } as any)
    .eq('id', profile.company_id)

  if (error) return { error: 'Failed to update company details' }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function updateCompanyBranding(formData: FormData) {
  const supabase = createServerSupabaseClient()
  
  const { user } = await serverClient.getUser()
  if (!user) return { error: 'Unauthorized' }

  const isAdmin = await serverClient.isAdmin(user.id)
  if (!isAdmin) return { error: 'Permission denied. Admin access required.' }

  const { data: profile } = await fetchRecord(supabase, 'profiles', user.id)
  if (!profile || !profile.company_id) return { error: 'Company not found' }

  const primary_color = formData.get('primary_color') as string
  const secondary_color = formData.get('secondary_color') as string
  const accent_color = formData.get('accent_color') as string
  const sidebar_color = formData.get('sidebar_color') as string
  
  let logo_url = formData.get('existing_logo') as string
  const logoFile = formData.get('logo') as File

  if (logoFile && logoFile.size > 0) {
    // Upload logic using admin client to bypass storage RLS
    const fileExt = logoFile.name.split('.').pop()
    const fileName = `${profile.company_id}-${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await adminClient.client.storage
      .from('companies')
      .upload(filePath, logoFile)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { error: 'Failed to upload logo' }
    }

    const { data: { publicUrl } } = adminClient.client.storage
      .from('companies')
      .getPublicUrl(filePath)
    
    logo_url = publicUrl
  }

  // Get current settings to merge
  const { data: currentCompany } = await fetchRecord(adminClient.client, 'companies', profile.company_id)
  const currentSettings = (currentCompany as any)?.settings || {}

  // Use admin client to bypass RLS and problematic RPC on companies table
  const { error } = await (adminClient.client as any)
    .from('companies')
    .update({
      primary_color,
      secondary_color,
      accent_color,
      logo_url,
      settings: {
        ...currentSettings,
        sidebar_color
      }
    } as any)
    .eq('id', profile.company_id)

  if (error) return { error: 'Failed to update branding' }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
