'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/useToast'
import { fetchRecords, insertRecord } from '@/lib/supabase/rpc-helpers'

export function QRScanner() {
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleScan = async () => {
    setLoading(true)
    try {
      // 1. Verify QR code
      const { data: qrDataList, error: qrError } = await fetchRecords(
        supabase,
        'qr_codes',
        {
          filters: { code: qrCode },
          limit: 1
        }
      )

      if (qrError) throw qrError
      
      const qrData = qrDataList?.[0]
      if (!qrData) throw new Error('Invalid QR Code')
      
      if (!qrData.is_active) throw new Error('QR Code is inactive')
      
      if (new Date(qrData.valid_until) < new Date()) {
        throw new Error('QR Code has expired')
      }

      const metadata = qrData.metadata as { employee_id?: string }
      if (!metadata?.employee_id) throw new Error('Invalid QR Code: No employee linked')

      // 2. Log attendance
      const { error: attendanceError } = await insertRecord(
        supabase,
        'attendance',
        {
          company_id: qrData.company_id,
          employee_id: metadata.employee_id,
          date: new Date().toISOString().split('T')[0],
          time_in: new Date().toISOString(),
          status: 'present',
        }
      )

      if (attendanceError) throw attendanceError

      toast({
        title: 'Success',
        description: 'Attendance logged successfully',
        variant: 'default'
      })

      setQrCode('')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify QR code',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Scan QR Code"
        value={qrCode}
        onChange={(e) => setQrCode(e.target.value)}
      />
      <Button onClick={handleScan} disabled={loading || !qrCode}>
        Log Attendance
      </Button>
    </div>
  )
}
