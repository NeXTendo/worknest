'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreVertical, Edit2, Trash2, Shield, UserCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Profile } from '@/lib/database.types'

interface UserCardProps {
  user: Profile
  onEdit: (user: Profile) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
}

export function UserCard({ user, onEdit, onDelete, onToggleStatus }: UserCardProps) {
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    return user.email.substring(0, 2).toUpperCase()
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive'
      case 'main_admin': return 'default'
      case 'hr_admin': return 'secondary'
      case 'manager': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={user.avatar_url || undefined} alt={user.first_name || ''} />
              <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900 truncate">
                  {user.first_name} {user.last_name}
                </p>
                {user.role === 'super_admin' && <Shield className="h-3.5 w-3.5 text-amber-500" />}
              </div>
              <p className="text-sm text-slate-500 truncate">{user.email}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onToggleStatus(user.id, user.is_active)}
                className="cursor-pointer"
              >
                <UserCircle className="mr-2 h-4 w-4" /> 
                {user.is_active ? 'Deactivate Account' : 'Activate Account'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(user.id)}
                className="text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize text-[10px] px-2 py-0">
              {user.role.replace('_', ' ')}
            </Badge>
            <Badge variant={user.is_active ? 'success' : 'outline'} className="text-[10px] px-2 py-0">
              {user.is_active ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
          <span className="text-[10px] text-slate-400 capitalize">
            ID: {user.employee_id || 'N/A'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
