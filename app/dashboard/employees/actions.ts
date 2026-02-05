'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { generateEmployeeId, generateDefaultPassword } from '@/lib/utils'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface CreateEmployeeInput {
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  department_id: string
  job_title_id: string
  employment_type: string
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!profile) throw new Error('Profile not found')

    // Generate employee number
    const { count } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', profile.company_id)

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
    await supabase.from('profiles').insert({
      id: authUser.user.id,
      company_id: profile.company_id,
      role: 'employee',
      employee_id: employee_number,
      email: input.email,
      first_name: input.first_name,
      last_name: input.last_name,
      must_change_password: true,
    })

    // Create employee record
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        company_id: profile.company_id,
        user_id: authUser.user.id,
        employee_number,
        ...input,
      })
      .select()
      .single()

    if (employeeError) throw employeeError

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