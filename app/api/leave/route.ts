import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  
  try {
    let query = supabase
      .from('leave_requests')
      .select('*, employees(*)')
      .order('created_at', { ascending: false })
    
    if (status && status !== 'all') {
      query = query.eq('status', status)
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
    const { data, error } = await supabase
      .from('leave_requests')
      .insert(body)
      .select()
      .single<any>()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}