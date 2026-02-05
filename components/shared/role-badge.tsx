'use client'

import { Badge } from '@/components/ui/badge'
import { Shield, UserCog, Users, User } from 'lucide-react'

interface RoleBadgeProps {
  role: string
  showIcon?: boolean
}

export function RoleBadge({ role, showIcon = false }: RoleBadgeProps) {
  const getRoleStyles = () => {
    const styles: Record<string, { color: string; icon: any }> = {
      super_admin: { color: 'bg-purple-100 text-purple-800', icon: Shield },
      main_admin: { color: 'bg-blue-100 text-blue-800', icon: Shield },
      hr_admin: { color: 'bg-teal-100 text-teal-800', icon: UserCog },
      manager: { color: 'bg-orange-100 text-orange-800', icon: Users },
      employee: { color: 'bg-gray-100 text-gray-800', icon: User },
    }
    return styles[role] || styles.employee
  }

  const { color, icon: Icon } = getRoleStyles()

  return (
    <Badge className={color} variant="secondary">
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {role.replace('_', ' ')}
    </Badge>
  )
}