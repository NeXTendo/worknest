'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import QRCode from 'qrcode'
import { Download, RefreshCw } from 'lucide-react'

interface QRGeneratorProps {
  onGenerate?: (qrData: string) => void
}

export function QRGenerator({ onGenerate }: QRGeneratorProps) {
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function generateQR() {
    setLoading(true)
    try {
      // Generate unique QR code data
      const timestamp = new Date().toISOString()
      const randomId = Math.random().toString(36).substring(7)
      const qrData = `worknest-attendance-${timestamp}-${randomId}`

      // Generate QR code image
      const qrImage = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#14B8A6', // WorkNest teal
          light: '#FFFFFF',
        },
      })

      setQrCode(qrImage)
      setOpen(true)
      
      if (onGenerate) {
        onGenerate(qrData)
      }
    } catch (error) {
      console.error('QR generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  function downloadQR() {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `attendance-qr-${new Date().toLocaleDateString()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Button onClick={generateQR} disabled={loading}>
        {loading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate QR Code'
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Attendance QR Code</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {qrCode && (
              <Card className="p-4 flex justify-center">
                <img src={qrCode} alt="QR Code" className="w-64 h-64" />
              </Card>
            )}

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Scan this QR code to mark attendance
              </p>
              <p className="text-xs text-gray-500">
                Valid for today: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadQR} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={generateQR} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}