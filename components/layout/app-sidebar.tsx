'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'
import { useCompanyStore } from '@/store/useCompanyStore'
import { useUIStore } from '@/store/useUIStore'
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  DollarSign,
  Calendar,
  Megaphone,
  Settings,
  UserCog,
  ChevronLeft,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
  {
    title: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager'],
  },
  {
    title: 'Departments',
    href: '/dashboard/departments',
    icon: Building2,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager'],
  },
  {
    title: 'Attendance',
    href: '/dashboard/attendance',
    icon: ClipboardList,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
  {
    title: 'Payroll',
    href: '/dashboard/payroll',
    icon: DollarSign,
    roles: ['super_admin', 'main_admin', 'hr_admin'],
  },
  {
    title: 'Leave',
    href: '/dashboard/leave',
    icon: Calendar,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
  {
    title: 'Announcements',
    href: '/dashboard/announcements',
    icon: Megaphone,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: UserCog,
    roles: ['super_admin', 'main_admin'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['super_admin', 'main_admin'],
  },
  {
    title: 'About',
    href: '/dashboard/about',
    icon: Info,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { company } = useCompanyStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  const filteredNav = navigation.filter(item => 
    user?.role && item.roles.includes(user.role)
  )

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-worknest-navy text-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo & Company */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
          {company?.logo_url ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={company.logo_url} alt={company.name} />
              <AvatarFallback className="text-white font-bold" style={{ backgroundColor: company.primary_color }}>
                {company.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: company?.primary_color || '#14B8A6' }}
              title="Company Logo"
            >
              WN
            </div>
          )}
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-sm">{company?.name || 'WorkNest'}</span>
              <span className="text-xs text-white/60 capitalize">{user?.role?.replace('_', ' ')}</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft className={cn('h-5 w-5 transition-transform', !sidebarOpen && 'rotate-180')} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-worknest-teal text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
                !sidebarOpen && 'justify-center'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className={cn('text-xs text-white/50', !sidebarOpen && 'text-center')}>
          {sidebarOpen ? (
            <>
              <p>Powered by <span className="text-worknest-teal font-medium">TechOhns</span></p>
              <p className="mt-1">© 2024 All rights reserved</p>
            </>
          ) : (
            <p>TechOhns</p>
          )}
        </div>
      </div>
    </aside>
  )
}