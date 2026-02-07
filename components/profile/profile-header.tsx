'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Camera, Mail, Phone, MapPin } from 'lucide-react'
import { Employee } from '@/lib/database.types'

interface ProfileHeaderProps {
  employee: Employee
  isEditable?: boolean
  jobTitle?: string
}

export function ProfileHeader({ employee, isEditable = false, jobTitle }: ProfileHeaderProps) {
  const defaultFallback = employee?.first_name?.[0] || 'U'
  const fullName = `${employee.first_name || ''} ${employee.last_name || ''}`.trim()

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
      <div className="h-32 bg-gradient-to-r from-worknest-teal to-teal-600 relative">
        {/* Cover Photo Area - could be customizable later */}
      </div>
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 mb-4 gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src={employee.avatar_url || ''} alt={fullName} />
              <AvatarFallback className="text-2xl bg-slate-100 text-slate-500">
                {defaultFallback}
              </AvatarFallback>
            </Avatar>
            {isEditable && (
              <button 
                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-sm border border-slate-200 text-slate-600 hover:text-worknest-teal transition-colors"
                aria-label="Change profile picture"
                title="Change profile picture"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
            <p className="text-slate-500 font-medium">
               {jobTitle || 'No Job Title'} 
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <Badge variant={employee.employment_status === 'active' ? 'default' : 'secondary'} className={employee.employment_status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                {employee.employment_status?.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">{employee.employment_type?.replace('_', ' ')}</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{employee.email}</span>
            </div>
             {employee.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{employee.phone}</span>
              </div>
            )}
            {employee.city && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{employee.city}, {employee.country}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
