'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface EmployeeDrawerProps {
  employeeId: string | null
  isOpen: boolean
  onClose: () => void
}

export function EmployeeDrawer({ employeeId, isOpen, onClose }: EmployeeDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Employee Details</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <p className="text-gray-500">Employee ID: {employeeId}</p>
          {/* Full employee details would go here */}
        </div>
      </SheetContent>
    </Sheet>
  )
}