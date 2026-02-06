import { createServerSupabaseClient } from '@/lib/supabase/server'
import { updateRecord, fetchRecord, deleteRecord } from '@/lib/supabase/rpc-helpers'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/database.types'

type EmployeeRow = Database['public']['Tables']['employees']['Row']
type EmployeeUpdate = Database['public']['Tables']['employees']['Update']

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await fetchRecord(supabase, 'employees', params.id)

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
  const body = await request.json()

  try {
    const { data: recordId, error } = await updateRecord(
      supabase,
      'employees',
      params.id,
      body
    )
    
    if (error) throw error
    
    // Fetch the updated record to return it
    const { data: updatedEmployee, error: fetchError } = await fetchRecord(
      supabase,
      'employees',
      params.id
    )
    
    if (fetchError) throw fetchError
    return NextResponse.json(updatedEmployee)
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
    const { error } = await deleteRecord(supabase, 'employees', params.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
