import { createServerSupabaseClient } from '@/lib/supabase/server'
import { batchInsert } from '@/lib/supabase/rpc-helpers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const { employee_ids, pay_period } = await request.json()
  
  try {
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, base_salary')
      .in('id', employee_ids)

    if (empError) throw empError
    if (!employees) throw new Error('No employees found')

    const payrollRecords = employees.map((emp: { id: string; base_salary: number | null }) => {
      const baseSalary = emp.base_salary || 0
      // Assuming pay_period is passed as { start, end } or handling it defensively
      // If it's a string, we might need a better parsing logic, but for types we need strings
      const payPeriodStart = (pay_period as any)?.start || new Date().toISOString()
      const payPeriodEnd = (pay_period as any)?.end || new Date().toISOString()
      
      return {
        employee_id: emp.id,
        pay_period_start: payPeriodStart,
        pay_period_end: payPeriodEnd,
        base_salary: baseSalary,
        gross_pay: baseSalary, // Initial gross pay equals base salary before additions
        bonuses: 0,
        allowances: 0,
        commission: 0,
        other_deductions: 0,
        total_deductions: 0, // deductions was not in schema, assuming total_deductions
        tax: baseSalary * 0.20,
        net_pay: baseSalary * 0.80,
        status: 'processing' as const,
      }
    })

    // Use batchInsert helper to bypass strict type inference issues
    const { data, error } = await batchInsert(
      supabase,
      'payroll',
      payrollRecords
    )

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}