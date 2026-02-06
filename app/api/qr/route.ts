import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const { employee_id } = await request.json()
  
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

    // Generate unique code
    const code = `WN-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const now = new Date()
    const validUntil = new Date()
    validUntil.setHours(23, 59, 59, 999)

    // Save to database
    const { data: qrData, error: dbError } = await supabase
      .from('qr_codes')
      .insert({
        code,
        type: 'attendance',
        valid_from: now.toISOString(),
        valid_until: validUntil.toISOString(),
        is_active: true,
        metadata: { employee_id }, // Store employee_id in metadata since it's not a direct column
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Generate QR code image
    const qrImage = await QRCode.toDataURL(code)

    return NextResponse.json({
      code,
      qr_image: qrImage,
      valid_until: validUntil.toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*, employees(*)')
      .gte('valid_until', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}