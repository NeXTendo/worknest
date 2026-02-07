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
  X,
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
  const { sidebarOpen, toggleSidebar, mobileSidebarOpen, toggleMobileSidebar } = useUIStore()

  // Sync sidebar color to CSS variable for live preview support
  React.useEffect(() => {
    const color = (company?.settings as any)?.sidebar_color
    if (color && color !== 'transparent') {
      document.documentElement.style.setProperty('--brand-sidebar', color)
    } else {
      // Fallback to WorkNest Navy if no color set
      document.documentElement.style.setProperty('--brand-sidebar', '#0F172A')
    }
  }, [company])

  // Get sidebar color from settings or default to navy
  // const sidebarColor = (company?.settings as any)?.sidebar_color || 'var(--worknest-navy)'

  const filteredNav = navigation.filter(item => 
    user?.role && item.roles.includes(user.role)
  )

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen text-white transition-all duration-300 shadow-xl',
          'lg:translate-x-0', // Always visible on desktop
          mobileSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:w-20', // Mobile toggle
          sidebarOpen && 'lg:w-64' // Desktop expand
        )}
        style={{ backgroundColor: 'var(--brand-sidebar)' }}
      >
        {/* Logo & Company */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-white/10 brand-border-alpha">
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'lg:justify-center')}>
            {company?.logo_url ? (
              <div 
                className={cn(
                  "relative overflow-hidden flex-shrink-0 transition-all duration-300",
                  sidebarOpen || mobileSidebarOpen ? "h-12 w-12" : "h-10 w-10"
                )}
              >
                <Image src={company.logo_url} alt={company.name} fill className="object-contain" />
              </div>
            ) : (
              <div 
                className={cn(
                  "rounded-xl flex items-center justify-center text-white font-bold brand-bg transition-all duration-300 shadow-md",
                  sidebarOpen || mobileSidebarOpen ? "h-12 w-12 text-xl" : "h-10 w-10 text-lg"
                )}
                title="Company Logo"
              >
                {company?.name?.[0] || 'W'}
              </div>
            )}
            
            {(sidebarOpen || mobileSidebarOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base truncate leading-tight">{company?.name || 'WorkNest'}</span>
                <span className="text-[11px] text-white/60 uppercase tracking-wider font-medium">{user?.role?.replace('_', ' ')}</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-white/10 hidden lg:flex h-8 w-8"
          >
            <ChevronLeft className={cn('h-5 w-5 transition-transform', !sidebarOpen && 'rotate-180')} />
          </Button>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileSidebar}
            className="text-white hover:bg-white/10 lg:hidden"
          >
            <X className="h-6 w-6" />
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
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
                !sidebarOpen && !mobileSidebarOpen && 'justify-center lg:justify-center'
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-white/70 group-hover:text-white")} />
              {(sidebarOpen || mobileSidebarOpen) && <span className="truncate">{item.title}</span>}
              {!sidebarOpen && !mobileSidebarOpen && isActive && (
                <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full lg:block hidden" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 brand-border-alpha">
        <div className={cn('text-[10px] text-white/40', !sidebarOpen && !mobileSidebarOpen && 'lg:text-center text-left')}>
          {sidebarOpen || mobileSidebarOpen ? (
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
    </>
  )
}