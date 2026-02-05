import QRCode from 'qrcode'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function generateAttendanceQR(companyId: string): Promise<string> {
  const supabase = createServerSupabaseClient()
  
  // Create unique code
  const code = `${companyId}-${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Set validity period (8 hours)
  const validFrom = new Date()
  const validUntil = new Date(validFrom.getTime() + 8 * 60 * 60 * 1000)
  
  // Save to database
  await supabase.from('qr_codes').insert({
    company_id: companyId,
    code,
    type: 'attendance',
    valid_from: validFrom.toISOString(),
    valid_until: validUntil.toISOString(),
    is_active: true,
  })
  
  // Generate QR code as data URL
  const qrCodeDataURL = await QRCode.toDataURL(code, {
    width: 400,
    margin: 2,
    color: {
      dark: '#14B8A6',
      light: '#FFFFFF',
    },
  })
  
  return qrCodeDataURL
}

export async function validateQRCode(code: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single()
  
  if (error || !data) return false
  
  const now = new Date()
  const validFrom = new Date(data.valid_from)
  const validUntil = new Date(data.valid_until)
  
  return now >= validFrom && now <= validUntil
}