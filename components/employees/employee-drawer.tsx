'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { EmployeeForm } from './employee-form'
import { Button } from '@/components/ui/button'
import { Edit2, X } from 'lucide-react'

interface EmployeeDrawerProps {
  employeeId: string | null
  isOpen: boolean
  onClose: () => void
}

export function EmployeeDrawer({ employeeId, isOpen, onClose }: EmployeeDrawerProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setMode('view')
        onClose()
      }
    }}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <SheetTitle>
            {employeeId ? (mode === 'view' ? 'Employee Details' : 'Edit Employee') : 'Add Employee'}
          </SheetTitle>
          {employeeId && mode === 'view' && (
            <Button variant="outline" size="sm" onClick={() => setMode('edit')}>
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
        </SheetHeader>
        
        <div className="mt-6">
          {(!employeeId || mode === 'edit') ? (
            <EmployeeForm 
              employeeId={employeeId} 
              onSuccess={() => {
                setMode('view')
                if (!employeeId) onClose()
              }}
              onCancel={() => {
                if (employeeId) setMode('view')
                else onClose()
              }}
            />
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 italic">Viewing details for: {employeeId}</p>
              {/* Detailed view component could go here, for now using form for simplicity */}
              <EmployeeForm 
                employeeId={employeeId} 
                onSuccess={() => setMode('view')}
                onCancel={() => setMode('view')}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}