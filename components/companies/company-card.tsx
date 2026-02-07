'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Users, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Globe, 
  Phone, 
  Mail,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Company } from '@/lib/database.types'

interface CompanyCardProps {
  company: Company
  onEdit: (company: Company) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
}

export function CompanyCard({ company, onEdit, onDelete, onToggleStatus }: CompanyCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-slate-200 group overflow-hidden bg-white">
      {/* Visual Stripe with Company Primary Color */}
      <div 
        className="h-2 w-full" 
        style={{ backgroundColor: company.primary_color || '#0f172a' }}
      />
      
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 pt-6">
        <div className="flex items-center gap-4">
          <div 
            className="h-14 w-14 rounded-xl flex items-center justify-center shadow-inner overflow-hidden border border-slate-100"
            style={{ backgroundColor: `${company.primary_color}10` || '#f1f5f9' }}
          >
            {company.logo_url ? (
              <div className="relative h-10 w-10">
                <Image src={company.logo_url} alt={company.name} fill className="object-contain" />
              </div>
            ) : (
              <Building2 className="h-7 w-7" style={{ color: company.primary_color || '#0f172a' }} />
            )}
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {company.name}
            </CardTitle>
            <Badge variant="outline" className="w-fit mt-1 bg-slate-50 text-slate-600 border-slate-200 font-medium capitalize">
              {company.industry || 'General'}
            </Badge>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(company)} className="cursor-pointer py-2">
              <Edit2 className="mr-3 h-4 w-4 text-blue-500" /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onToggleStatus(company.id, company.is_active)} 
              className="cursor-pointer py-2"
            >
              {company.is_active ? (
                <>
                  <ShieldAlert className="mr-3 h-4 w-4 text-orange-500" /> Deactivate
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-3 h-4 w-4 text-green-500" /> Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(company.id)} 
              className="text-destructive cursor-pointer py-2"
            >
              <Trash2 className="mr-3 h-4 w-4" /> Delete Company
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact info grid */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          {company.website && (
            <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors truncate">
              <Globe className="h-3.5 w-3.5" />
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="truncate">
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {company.email && (
            <div className="flex items-center gap-2 text-slate-500 truncate">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{company.email}</span>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center gap-2 text-slate-500">
              <Phone className="h-3.5 w-3.5" />
              <span>{company.phone}</span>
            </div>
          )}
        </div>
        
        {/* Stats footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs transition-colors group-hover:bg-blue-100">
            <Users className="h-3.5 w-3.5" />
            <span>{company.employee_count} Employees</span>
          </div>
          
          <Badge 
            className={`
              ${company.is_active 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
              } px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider
            `}
          >
            {company.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
