import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/database.types'

type EmployeeRow = Database['public']['Tables']['employees']['Row']
type EmployeeUpdate = Database['public']['Tables']['employees']['Update']

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', params.id)
      .single<EmployeeRow>()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const body = await request.json() as EmployeeUpdate

  try {
    const { data, error } = await supabase
      .from('employees')
      .update(body as any)
      .eq('id', params.id)
      .select()
      .single<EmployeeRow>()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', params.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}