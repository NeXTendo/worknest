'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Database, EmploymentType } from '@/lib/database.types'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { generateEmployeeId, generateDefaultPassword } from '@/lib/utils'
import { insertRecord, fetchRecord, countRecords } from '@/lib/supabase/rpc-helpers'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface CreateEmployeeInput {
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  department_id: string
  job_title_id: string
  employment_type: EmploymentType
  hire_date: string
  base_salary: number
  // ... other fields
}

export async function createEmployee(input: CreateEmployeeInput) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get current user and company
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile, error: profileFetchError } = await fetchRecord(supabase, 'profiles', user.id)
    if (profileFetchError || !profile || !profile.company_id) throw new Error('Profile or Company ID not found')

    // Generate employee number
    const { count, error: countError } = await countRecords(supabase, 'employees', {
      company_id: profile.company_id
    })

    if (countError) throw new Error('Failed to generate employee number')

    const employee_number = generateEmployeeId(count || 0)

    // Generate default password
    const defaultPassword = generateDefaultPassword(input.date_of_birth)

    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: input.email,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: {
        first_name: input.first_name,
        last_name: input.last_name,
      },
    })

    if (authError) throw authError

    // Create profile
    const { error: profileError } = await insertRecord(supabase, 'profiles', {
      id: authUser.user.id,
      company_id: profile.company_id,
      role: 'employee',
      employee_id: employee_number,
      email: input.email,
      first_name: input.first_name,
      last_name: input.last_name,
      must_change_password: true,
      // Add required fields with default values or keep them optional if defined as such in usage
      is_active: true,
      preferences: {},
    })
    
    if (profileError) {
      // Cleanup auth user if profile creation fails? For now just throw
      console.error('Error creating profile:', profileError)
      throw new Error('Failed to create profile')
    }

    // Create employee record
    const { data: employeeId, error: employeeInsertError } = await insertRecord(supabase, 'employees', {
      company_id: profile.company_id,
      user_id: authUser.user.id,
      employee_number,
      ...input,
      // Ensure required fields are present. Input covers most.
      is_active: true,
    })

    if (employeeInsertError) throw employeeInsertError
    if (!employeeId) throw new Error('Failed to retrieve employee ID')

    const { data: employee, error: employeeFetchError } = await fetchRecord(supabase, 'employees', employeeId)

    if (employeeFetchError) throw employeeFetchError

    // Send welcome email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: input.email,
      subject: 'Welcome to WorkNest',
      html: `
        <h1>Welcome ${input.first_name}!</h1>
        <p>Your employee account has been created.</p>
        <p><strong>Login Details:</strong></p>
        <ul>
          <li>Employee ID: ${employee_number}</li>
          <li>Email: ${input.email}</li>
          <li>Default Password: ${defaultPassword}</li>
        </ul>
        <p>Please change your password after first login.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login">Login Now</a>
      `,
    })

    revalidatePath('/dashboard/employees')
    
    return { success: true, employee }
  } catch (error) {
    console.error('Error creating employee:', error)
    return { success: false, error: 'Failed to create employee' }
  }
}