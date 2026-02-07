'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard,
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  Building2,
  Megaphone,
  Settings,
  Info,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Profile {
  id: string
  role: string
  first_name: string | null
  last_name: string | null
  email: string
  avatar_url: string | null
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, first_name, last_name, email, avatar_url')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Profile load error:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/dashboard', icon: LayoutDashboard },
    { name: 'Employees', href: '/dashboard/employees', icon: Users },
    { name: 'Departments', href: '/dashboard/departments', icon: Building2 },
    { name: 'Attendance', href: '/dashboard/attendance', icon: Clock },
    { name: 'Payroll', href: '/dashboard/payroll', icon: DollarSign },
    { name: 'Leave', href: '/dashboard/leave', icon: Calendar },
    { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
    { name: 'Users', href: '/dashboard/users', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'About', href: '/dashboard/about', icon: Info },
  ]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
         {/* Logo */}
<div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
  <Link href="/dashboard/dashboard" className="flex items-center gap-2">
    <div className="-ml-2"> {/* Moves logo slightly left */}
      <Image
        src="/worknest-logo.png"   // your logo path
        alt="WorkNest Logo"
        width={48}           // slightly larger
        height={48}          // slightly larger
        className="object-contain"
      />
    </div>
    <span className="text-white font-semibold text-xl">WorkNest</span>
  </Link>
  <button 
    onClick={() => setSidebarOpen(false)}
    className="lg:hidden text-gray-400 hover:text-white"
    aria-label="Close sidebar"
  >
    <X className="h-6 w-6" />
  </button>
</div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-worknest-teal text-white shadow-lg shadow-worknest-teal/20' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-worknest-teal flex items-center justify-center text-white font-semibold shadow-lg">
                {profile?.first_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.email
                  }
                </p>
                <p className="text-xs text-gray-400 capitalize">{profile?.role?.replace('_', ' ')}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm" 
              className="w-full border-slate-700 text-gray-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 lg:flex lg:items-center lg:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden md:inline">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}