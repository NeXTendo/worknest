'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getActiveQRCodes, deactivateQR } from '../actions'
import { formatDate, formatTime } from '@/lib/utils'
import { Trash2, QrCode, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import QRCode from 'qrcode'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface QRCodeRecord {
  id: string
  code: string
  type: string
  valid_from: string
  valid_until: string
  usage_count: number
  created_at: string
}

export function ActiveQRList() {
  const [qrs, setQrs] = useState<QRCodeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadQRs()
  }, [])

  async function loadQRs() {
    setLoading(true)
    const data = await getActiveQRCodes()
    setQrs(data)
    setLoading(false)
  }

  async function handleDeactivate(id: string) {
    const res = await deactivateQR(id)
    if (res.success) {
      toast({ title: "Success", description: "QR Code deactivated" })
      loadQRs()
    } else {
      toast({ variant: "destructive", title: "Error", description: res.error })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Active QR Codes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
        ) : qrs.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No active QR codes found.</div>
        ) : (
           <div className="space-y-4">
             {qrs.map(qr => (
               <div key={qr.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                 <div className="space-y-1">
                   <div className="flex items-center gap-2">
                     <Badge variant="outline" className="uppercase">{qr.type}</Badge>
                     <span className="text-xs text-gray-500">Created: {formatDate(qr.created_at)}</span>
                   </div>
                   <p className="text-sm font-medium">Expires: {formatDate(qr.valid_until)} {formatTime(qr.valid_until)}</p>
                   <p className="text-xs text-gray-500">Scans: {qr.usage_count || 0}</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <QRPreviewButton code={qr.code} />
                   <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeactivate(qr.id)}>
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
             ))}
           </div>
        )}
      </CardContent>
    </Card>
  )
}

function QRPreviewButton({ code }: { code: string }) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(code, { width: 300, margin: 2 }).then(setUrl)
  }, [code])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>Scan Code</DialogTitle>
        </DialogHeader>
        {url && (
          <div className="p-4 bg-white rounded-lg border shadow-sm">
            <Image src={url} alt="QR Code" width={250} height={250} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
