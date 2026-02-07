'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { Department } from '@/lib/database.types'

interface DepartmentCardProps {
  department: Department
  onEdit: (department: Department) => void
  onDelete: (id: string) => void
}

export function DepartmentCard({ department, onEdit, onDelete }: DepartmentCardProps) {
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on dropdown or buttons
    if ((e.target as HTMLElement).closest('[role="menuitem"]') || (e.target as HTMLElement).closest('button')) {
      return
    }
    router.push(`/dashboard/departments/${department.id}`)
  }

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer relative group"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-worknest-teal/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-worknest-teal" />
          </div>
          <CardTitle className="text-lg font-bold truncate max-w-[150px]">
            {department.name}
          </CardTitle>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(department)} className="cursor-pointer">
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(department.id)} 
              className="text-destructive cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
          {department.description || 'No description provided.'}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{department.employee_count} Members</span>
          </div>
          {!department.is_active && (
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
              Inactive
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
