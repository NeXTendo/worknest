'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { Database, EmploymentType } from '@/lib/database.types'
import { revalidatePath } from 'next/cache'
import { generateEmployeeId, generateDefaultPassword } from '@/lib/utils'
import { insertRecord, fetchRecord, countRecords, updateRecord } from '@/lib/supabase/rpc-helpers'

interface CreateEmployeeInput {
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  department_id: string
  job_title_id?: string
  employment_type: EmploymentType
  hire_date: string
  base_salary: number
  company_id?: string // Optional for Super Admin to specify
}

export async function createEmployee(input: CreateEmployeeInput) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get current user profile for permission check
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) throw new Error('Unauthorized')

    const { data: currentProfile } = await fetchRecord(supabase, 'profiles', currentUser.id)
    if (!currentProfile) throw new Error('Current user profile not found')

    // Determine target company_id
    let targetCompanyId = currentProfile.company_id
    
    // If Super Admin, they can specify a different company
    if (currentProfile.role === 'super_admin' && input.company_id) {
      targetCompanyId = input.company_id
    }

    if (!targetCompanyId) throw new Error('Company ID is required')

    // Generate employee number
    const { count } = await countRecords(supabase, 'employees', {
      company_id: targetCompanyId
    })

    const employee_number = generateEmployeeId(count || 0)

    // Generate default password: [first_letter_lowercase][MMYYYY]
    const defaultPassword = generateDefaultPassword(input.first_name, input.date_of_birth)

    // 1. Create Supabase Auth User via Admin API
    // Note: This triggers the "Confirm Signup" email from Supabase templates if enabled.
    const { data: authUser, error: authError } = await adminClient.createUser(
      input.email, 
      defaultPassword,
      {
        company_id: targetCompanyId,
        role: 'employee',
        first_name: input.first_name,
        last_name: input.last_name,
      }
    )

    if (authError || !authUser?.user) throw authError || new Error('Auth user creation failed')
    const userId = authUser.user.id

    // 2. Ensure the profile exists and is linked
    // We use upsert with the admin client to bypass RLS and guarantee the record exists
    const { error: profileUpsertError } = await (adminClient.client
      .from('profiles') as any)
      .upsert({
        id: userId,
        company_id: targetCompanyId,
        role: 'employee',
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        must_change_password: true,
        is_active: true,
        preferences: {},
      })

    if (profileUpsertError) {
      console.error('Profile upsert error:', profileUpsertError)
      throw new Error(`Failed to create user profile: ${profileUpsertError.message}`)
    }

    // 3. Create employee record
    const employeeData = {
      ...input,
      company_id: targetCompanyId,
      user_id: userId,
      employee_number,
      is_active: true,
    }
    
    // Remote company_id from input as it's already handled
    delete (employeeData as any).company_id;
    (employeeData as any).company_id = targetCompanyId // Re-set to ensure it's the right one

    const { data: employeeId, error: employeeInsertError } = await insertRecord(supabase, 'employees', employeeData as any)

    if (employeeInsertError) throw employeeInsertError
    if (!employeeId) throw new Error('Failed to create employee record')

    // 4. Update profile with the final employee UUID
    await updateRecord(supabase, 'profiles', userId, { employee_id: employeeId })

    revalidatePath('/dashboard/employees')
    
    return { success: true, employeeId }
  } catch (error: any) {
    console.error('Error creating employee onboarding:', error)
    return { success: false, error: error.message || 'Failed to onboard employee' }
  }
}