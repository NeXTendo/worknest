import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    const { type = 'attendance' } = body

    // Generate QR code data
    const timestamp = new Date().toISOString()
    const randomId = Math.random().toString(36).substring(7)
    const qrData = `worknest-${type}-${timestamp}-${randomId}`

    // Generate QR code image as data URL
    const qrImage = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: {
        dark: '#14B8A6',
        light: '#FFFFFF',
      },
    })

    // Save QR code record to database
    const validFrom = new Date()
    const validUntil = new Date(validFrom.getTime() + 8 * 60 * 60 * 1000) // 8 hours

    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        code: qrData,
        type,
        valid_from: validFrom.toISOString(),
        valid_until: validUntil.toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      qrCode: qrImage, 
      data: qrData,
      validUntil: validUntil.toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'QR code required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ valid: false })
    }

    const now = new Date()
    const validFrom = new Date(data.valid_from)
    const validUntil = new Date(data.valid_until)

    const isValid = now >= validFrom && now <= validUntil

    return NextResponse.json({ valid: isValid, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}