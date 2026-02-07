'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { logAttendance } from '../actions'
import { useToast } from '@/hooks/useToast'
import { Loader2, Camera, CheckCircle2, XCircle } from 'lucide-react'

export function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const { toast } = useToast()

  useEffect(() => {
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
    
    // Small timeout to ensure DOM element exists
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
    if (scannerRef.current) {
      // Pause scanning to process
       // scannerRef.current.pause() 
       // Ideally we stop it or just ignore subsequent scans
       await stopScanner()
    }

    toast({
      title: "Processing...",
      description: "Verifying QR code...",
    })

    try {
      const res = await logAttendance(decodedText)
      
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
    }
  }

  const onScanFailure = (error: any) => {
    // console.warn(`Code scan error = ${error}`)
    // This fires frequently when no QR is found, so we usually ignore it
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
      <Card className="w-full shadow-lg border-2">
        <CardContent className="p-0 overflow-hidden relative min-h-[300px] flex flex-col items-center justify-center bg-black/5">
          
          {!scanning && !result && (
            <div className="text-center p-8 space-y-4">
              <div className="bg-white p-4 rounded-full shadow-sm inline-block">
                <Camera className="h-8 w-8 text-worknest-teal" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ready to Scan</h3>
                <p className="text-sm text-gray-500">Position the QR code within the frame</p>
              </div>
              <Button onClick={startScanner} className="bg-worknest-teal hover:bg-worknest-teal/90">
                Start Camera
              </Button>
            </div>
          )}

          {scanning && (
            <div className="w-full">
              <div id="reader" className="w-full" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={stopScanner}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-xs"
              >
                Cancel
              </Button>
            </div>
          )}

          {result && (
            <div className="text-center p-8 space-y-4 animate-in fade-in zoom-in">
              <div className={`p-4 rounded-full shadow-sm inline-block ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {result.success ? (
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{result.success ? 'Success!' : 'Failed'}</h3>
                <p className="text-sm text-gray-600">{result.message}</p>
              </div>
              <Button onClick={startScanner} variant="outline" className="mt-4">
                Scan Another
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <p className="text-xs text-center text-gray-400 mt-4">
        Ensure you have granted camera permissions to the browser.
      </p>
    </div>
  )
}
