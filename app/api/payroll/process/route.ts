import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const { employee_ids, pay_period } = await request.json()
  
  try {
    // Fetch employees
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, base_salary')
      .in('id', employee_ids)

    if (empError) throw empError

    // Process payroll for each employee
    const payrollRecords = employees.map(emp => ({
      employee_id: emp.id,
      pay_period,
      basic_salary: emp.base_salary || 0,
      bonuses: 0,
      deductions: 0,
      tax: (emp.base_salary || 0) * 0.20, // 20% tax example
      net_pay: (emp.base_salary || 0) * 0.80,
      status: 'processing',
    }))

    const { data, error } = await supabase
      .from('payroll')
      .insert(payrollRecords)
      .select()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}