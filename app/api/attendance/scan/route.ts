import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!profile?.company_id) {
      return NextResponse.json({ error: 'Company not found' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('attendance')
      .insert({ ...body, company_id: profile.company_id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}