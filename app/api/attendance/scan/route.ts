import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/database.types'

type Employee = Database['public']['Tables']['employees']['Row']

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  
  try {
    let query = supabase
      .from('attendance')
      .select('*, employees(*)')
      .order('check_in', { ascending: false })
    
    if (date) {
      query = query.eq('date', date)
    }

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const body = await request.json()
  
  try {
    // Get current user's company_id
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id, company_id')
      .eq('user_id', user.id)
      .single<Pick<Employee, 'id' | 'company_id'>>()

    if (employeeError || !employee) {
      return NextResponse.json({ error: 'Employee record not found' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('attendance')
      .insert({
        ...body,
        employee_id: employee.id,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}