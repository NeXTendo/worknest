'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { logAttendance } from '../actions'
import { useToast } from '@/hooks/useToast'
import { Loader2, Camera, CheckCircle2, XCircle, QrCode } from 'lucide-react'

export function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Request geolocation early if possible
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
        },
        (err) => {
          console.warn("Geolocation error:", err.message)
        }
      )
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5-qrcode scanner. ", error)
        })
      }
    }
  }, [])

  const startScanner = () => {
    setScanning(true)
    setResult(null)
    
    // Refresh location if possible
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
      })
    }

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        /* verbose= */ false
      )
      
      scannerRef.current = scanner
      scanner.render(onScanSuccess, onScanFailure)
    }, 100)
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear()
        setScanning(false)
      } catch (error) {
        console.error("Failed to stop scanner", error)
      }
    }
  }

  const onScanSuccess = async (decodedText: string) => {
    await stopScanner()

    toast({
      title: "Processing...",
      description: "Verifying attendance...",
    })

    try {
      const res = await logAttendance(decodedText, location || 'Browser Geolocation')
      
      if (res.success) {
        setResult({ success: true, message: res.message || 'Attendance logged!' })
        toast({
          title: "Success",
          description: res.message,
          className: "bg-green-50 border-green-200"
        })
      } else {
        setResult({ success: false, message: res.error || 'Failed to log attendance' })
        toast({
          variant: "destructive",
          title: "Error",
          description: res.error,
        })
      }
    } catch (err) {
      setResult({ success: false, message: 'Unexpected error occurred' })
      toast({
        variant: "destructive",
        title: "System Error",
        description: "An unexpected error occurred while processing your attendance.",
      })
    }
  }

  const onScanFailure = (error: any) => {
    // frequent, ignore
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
      <Card className="w-full shadow-2xl border-none bg-white overflow-hidden">
        <div className="brand-bg p-6 text-white text-center">
          <QrCode className="h-12 w-12 mx-auto mb-2 opacity-90" />
          <h3 className="text-xl font-bold">Attendance Scanner</h3>
          <p className="text-white/70 text-sm">Scan to Check-In or Out</p>
        </div>

        <CardContent className="p-0 relative min-h-[350px] flex flex-col items-center justify-center bg-gray-50/50">
          
          {!scanning && !result && (
            <div className="text-center p-10 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-xl inline-block border border-gray-100 animate-pulse">
                <Camera className="h-10 w-10 text-worknest-teal" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-slate-800">Ready to Scan</h3>
                <p className="text-sm text-slate-500 max-w-[200px] mx-auto">Place the company QR code inside the camera frame.</p>
              </div>
              <Button 
                onClick={startScanner} 
                className="w-full h-14 text-lg font-bold brand-bg hover:opacity-90 rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Launch Scanner
              </Button>
            </div>
          )}

          {scanning && (
            <div className="w-full h-full relative">
              <div id="reader" className="w-full" />
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                 <div className="w-full h-full border-2 border-white/50 border-dashed rounded-lg" />
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={stopScanner}
                className="absolute top-4 right-4 rounded-full px-4 font-bold shadow-xl"
              >
                Cancel
              </Button>
            </div>
          )}

          {result && (
            <div className="text-center p-10 space-y-6 animate-in fade-in zoom-in slide-in-from-bottom-4">
              <div className={`p-6 rounded-full shadow-2xl inline-block ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {result.success ? (
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-600" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className={`font-black text-2xl ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.success ? 'ACTION VERIFIED' : 'SCAN FAILED'}
                </h3>
                <p className="text-slate-600 font-medium">{result.message}</p>
              </div>
              <Button 
                onClick={startScanner} 
                variant="outline" 
                className="w-full h-12 border-2 text-lg font-bold rounded-2xl hover:bg-slate-50 transition-all"
              >
                Scan Another
              </Button>
            </div>
          )}
        </CardContent>

        <div className="p-4 bg-slate-50 border-t flex items-center justify-between text-[10px] text-slate-400 font-medium">
           <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${location ? 'bg-green-500' : 'bg-amber-500'}`} />
              {location ? `LOC: ${location}` : 'AWAITING LOCATION...'}
           </div>
           <div className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin text-slate-300" />
              AUTO-MODE
           </div>
        </div>
      </Card>
      
      <p className="text-[11px] text-center text-slate-400 mt-6 leading-relaxed max-w-[280px]">
        Ensuring camera and location permissions are enabled for precise attendance tracking.
      </p>
    </div>
  )
}
