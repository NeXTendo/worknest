'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/useToast'

export function QRScanner() {
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleScan = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          qr_code: qrCode,
          check_in: new Date().toISOString(),
          status: 'present',
        })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Attendance logged',
      })

      setQrCode('')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
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
