'use client'

import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

interface PrintViewProps {
  children: React.ReactNode
  title?: string
}

export function PrintView({ children, title }: PrintViewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div>
      <div className="no-print mb-4">
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
      <div className="print:p-0">
        {title && (
          <h1 className="text-2xl font-bold mb-4 print:mb-2">{title}</h1>
        )}
        {children}
      </div>
    </div>
  )
}