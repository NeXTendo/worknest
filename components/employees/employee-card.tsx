'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Calendar } from 'lucide-react'

interface EmployeeCardProps {
  employee: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    employment_type: string
    employment_status: string
    hire_date: string
  }
  onClick?: () => void
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const getInitials = () => {
    return `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase()
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
            {getInitials()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {employee.first_name} {employee.last_name}
            </h3>
            <div className="space-y-1 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {employee.email}
              </div>
              {employee.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {employee.phone}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Hired: {new Date(employee.hire_date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary">{employee.employment_type.replace('_', ' ')}</Badge>
              <Badge variant="secondary">{employee.employment_status.replace('_', ' ')}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}