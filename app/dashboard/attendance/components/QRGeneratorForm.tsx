'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generateAttendanceQR } from '../actions'
import { Loader2, Download, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/useToast'

export function QRGeneratorForm() {
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const result = await generateAttendanceQR(formData)
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      } else if (result.qrDataUrl) {
        setQrCode(result.qrDataUrl)
        toast({
          title: "Success",
          description: "QR Code generated successfully",
        })
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrCode) return
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `attendance-qr-${new Date().toISOString().split('T')[0]}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generate QR Code</CardTitle>
          <CardDescription>Create a new code for employees to scan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Validity (Hours)</Label>
              <Input 
                id="hours" 
                name="hours" 
                type="number" 
                defaultValue={8} 
                min={1} 
                max={24} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue="any">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">General (In/Out)</SelectItem>
                  <SelectItem value="event">Event Check-in</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-worknest-teal hover:bg-worknest-teal/90">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Code
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-center min-h-[300px] bg-slate-50">
        {qrCode ? (
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
               <Image 
                 src={qrCode} 
                 alt="Generated QR Code" 
                 width={250} 
                 height={250}
                 className="mix-blend-multiply"
               />
            </div>
            <p className="text-sm text-gray-500 font-medium">Valid for 8 hours</p>
            <Button variant="outline" onClick={downloadQR}>
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
          </div>
        ) : (
          <div className="text-center text-gray-400 p-6">
            <RefreshCw className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Generated QR code will appear here</p>
          </div>
        )}
      </Card>
    </div>
  )
}
