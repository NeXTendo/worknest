'use client'

import React, { useState } from 'react'
import Image from 'next/image'
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
    href: '/dashboard/dashboard',
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
    title: 'Companies',
    href: '/dashboard/companies',
    icon: Building2,
    roles: ['super_admin'],
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
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10 brand-border-alpha">
        <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
          {company?.logo_url ? (
            <div className="h-10 w-10 relative overflow-hidden flex-shrink-0">
              <Image src={company.logo_url} alt={company.name} fill className="object-contain" />
            </div>
          ) : (
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold brand-bg"
              title="Company Logo"
            >
              {company?.name?.[0] || 'W'}
            </div>
          )}
          {sidebarOpen && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm truncate">{company?.name || 'WorkNest'}</span>
              <span className="text-[10px] text-white/50 uppercase tracking-wider">{user?.role?.replace('_', ' ')}</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10 hidden lg:flex"
        >
          <ChevronLeft className={cn('h-5 w-5 transition-transform', !sidebarOpen && 'rotate-180')} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all group',
                isActive
                  ? 'text-white shadow-lg brand-bg'
                  : 'text-white/60 hover:bg-white/5 hover:text-white',
                !sidebarOpen && 'justify-center'
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-white/60 group-hover:text-white")} />
              {sidebarOpen && <span className="truncate">{item.title}</span>}
              {!sidebarOpen && isActive && (
                <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 brand-border-alpha">
        <div className={cn('text-[10px] text-white/40', !sidebarOpen && 'text-center')}>
          {sidebarOpen ? (
            <div className="flex flex-col gap-1">
              <p>Powered by <span className="font-semibold brand-text">TechOhns</span></p>
              <p>© 2024 WorkNest</p>
            </div>
          ) : (
            <p className="font-bold brand-text">TO</p>
          )}
        </div>
      </div>
    </aside>
  )
}