'use server'

import { createServerSupabaseClient, serverClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin' // Keep for potential admin bypass if needed, but standard flow should respect RLS if possible. 
// Actually, for attendance logging, regular users might need to insert, subject to RLS. 
// But QR verification might need broader access or specific RPC.
import { fetchRecord, fetchRecords, insertRecord, updateRecord } from '@/lib/supabase/rpc-helpers'
import { AttendanceStatus } from '@/lib/database.types'
import { revalidatePath } from 'next/cache'
import QRCode from 'qrcode'

export async function generateAttendanceQR(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const { user } = await serverClient.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check if admin
  const isAdmin = await serverClient.isAdmin(user.id)
  if (!isAdmin) return { error: 'Permission denied' }

  const { data: profile } = await fetchRecord(supabase, 'profiles', user.id)
  if (!profile?.company_id) return { error: 'Company not found' }

  const hours = Number(formData.get('hours') || 8)
  const type = formData.get('type') as string || 'any'

  // Generate unique code content
  // Format: "worknest-qr-v1:[company_id]:[random_id]"
  // This helps us validate the format before even hitting the DB if we wanted to
  const codeContent = `worknest-qr-v1:${profile.company_id}:${Math.random().toString(36).substring(2, 15)}`

  const validFrom = new Date()
  const validUntil = new Date(validFrom.getTime() + hours * 60 * 60 * 1000)

  // Insert into DB
  const { error: dbError } = await insertRecord(supabase, 'qr_codes', {
    company_id: profile.company_id,
    code: codeContent,
    type,
    valid_from: validFrom.toISOString(),
    valid_until: validUntil.toISOString(),
    is_active: true,
    created_by: user.id
  })

  if (dbError) {
    console.error('QR DB Error:', dbError)
    return { error: 'Failed to save QR code' }
  }

  // Generate Data URL
  try {
    const qrDataUrl = await QRCode.toDataURL(codeContent, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
    return { success: true, qrDataUrl, code: codeContent }
  } catch (err) {
    console.error('QR Gen Error:', err)
    return { error: 'Failed to generate QR image' }
  }
}

export async function logAttendance(code: string, location?: string) {
  const supabase = createServerSupabaseClient()
  const { user } = await serverClient.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Get IP address from headers
  const { headers } = await import('next/headers')
  const headerList = await headers()
  const ipAddress = headerList.get('x-forwarded-for')?.split(',')[0] || headerList.get('x-real-ip') || '127.0.0.1'

  const { data: profile } = await fetchRecord(supabase, 'profiles', user.id)
  if (!profile?.company_id || !profile?.employee_id) return { error: 'Employee profile not found' }

  // 1. Verify QR Code
  const { data: qrRecords, error: qrError } = await fetchRecords(supabase, 'qr_codes', {
    filters: { code: code, is_active: true },
    limit: 1
  })

  if (qrError || !qrRecords || qrRecords.length === 0) {
    return { error: 'Invalid or expired QR code' }
  }

  const qr = qrRecords[0]
  if (qr.company_id !== profile.company_id) {
    return { error: 'Invalid QR code for your company' }
  }

  const now = new Date()
  if (new Date(qr.valid_until) < now) {
    return { error: 'QR Code has expired' }
  }

  // 2. Determine Action (Check In vs Check Out)
  const today = now.toISOString().split('T')[0]
  
  // Fetch existing attendance for today
  const { data: attendanceRecords } = await fetchRecords(supabase, 'attendance', {
    filters: { 
      employee_id: profile.employee_id,
      date: today
    },
    limit: 1
  })

  const existingRecord = attendanceRecords && attendanceRecords.length > 0 ? attendanceRecords[0] : null
  let message = ''

  if (existingRecord) {
    if (existingRecord.time_out) {
      return { error: 'You have already checked out for today' }
    }
    
    // Process Check Out
    if (!existingRecord.time_in) {
      return { error: 'Invalid attendance record: missing check-in time' }
    }
    const timeIn = new Date(existingRecord.time_in)
    const timeOut = now
    
    // Calculate hours worked (in hours, decimal)
    const diffMs = timeOut.getTime() - timeIn.getTime()
    const hoursWorked = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100
    
    // Calculate overtime (if > 8 hours)
    const overtimeHours = Math.max(0, hoursWorked - 8)

    const { error: updateError } = await updateRecord(supabase, 'attendance', existingRecord.id, {
      time_out: timeOut.toISOString(),
      hours_worked: hoursWorked,
      overtime_hours: overtimeHours,
      location: location || existingRecord.location, // Update location or keep old
      ip_address: ipAddress,
    })
    
    if (updateError) throw updateError
    message = `Successfully checked out! Worked ${hoursWorked} hours.`
  } else {
    // Process Check In
    const timeIn = now
    
    // Calculate lateness (Default 09:00 AM)
    const shiftStart = new Date(now)
    shiftStart.setHours(9, 0, 0, 0)
    
    let lateByMinutes = 0
    let status: AttendanceStatus = 'present'
    
    if (timeIn > shiftStart) {
      lateByMinutes = Math.floor((timeIn.getTime() - shiftStart.getTime()) / (1000 * 60))
      status = 'late'
    }
    
    const { error: insertError } = await insertRecord(supabase, 'attendance', {
      company_id: profile.company_id,
      employee_id: profile.employee_id,
      date: today,
      time_in: timeIn.toISOString(),
      status: status,
      late_by_minutes: lateByMinutes,
      location: location || 'Unknown',
      ip_address: ipAddress,
    })
    
    if (insertError) throw insertError
    message = lateByMinutes > 0 
      ? `Successfully checked in! You are ${lateByMinutes} minutes late.` 
      : 'Successfully checked in!'
  }
  
  // Increment usage count for QR via Admin Client
  await (adminClient.client
    .from('qr_codes') as any)
    .update({ usage_count: (qr.usage_count || 0) + 1 })
    .eq('id', qr.id)

  revalidatePath('/dashboard/attendance')
  revalidatePath('/dashboard') // Revalidate main dashboard too
  
  return { success: true, message }
}

export async function getActiveQRCodes() {
  const supabase = createServerSupabaseClient()
  const { user } = await serverClient.getUser()
  if (!user) return []

  const { data: profile } = await fetchRecord(supabase, 'profiles', user.id)
  if (!profile?.company_id) return []

  // Fetch active QRs for company
  // We can filter by valid_until > now in the query if possible, or filter in code.
  // supabase.from... normally allows .gt('valid_until', new Date().toISOString())
  
  const now = new Date().toISOString()
  
  const { data: qrs, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('company_id', profile.company_id)
    .eq('is_active', true)
    .gt('valid_until', now)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Fetch Active QR Error:', error)
    return []
  }
  
  return qrs as any[] // Cast or use proper type if available
}

export async function deactivateQR(id: string) {
  const supabase = createServerSupabaseClient()
  
  // Verify ownership? RLS should handle it, but good to check.
  // For now just update.
  
  const { error } = await updateRecord(supabase, 'qr_codes', id, { is_active: false })
    
  if (error) {
    return { success: false, error: 'Failed to deactivate' }
  }
  
  revalidatePath('/dashboard/attendance')
  return { success: true }
}
