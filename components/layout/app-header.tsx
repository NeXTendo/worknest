'use client'

import { Bell, Search, User, LogOut, Settings, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useCompanyStore } from '@/store/useCompanyStore'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AppHeader() {
  const { user, logout } = useAuthStore()
  const { company } = useCompanyStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        import('@/lib/supabase/client').then(mod => mod.resetBrowserClient())
        await supabase.auth.signOut()
        logout()
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`
    }
    return user?.email?.[0].toUpperCase() || 'W'
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="hidden md:flex relative max-w-md w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-worknest-teal"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-900">
          <Bell className="h-5 w-5" />
          <span 
            className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white" 
            style={{ backgroundColor: 'var(--brand-accent)' }} 
          />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 md:h-11 md:w-11 rounded-full p-0 overflow-hidden ring-offset-2 hover:ring-2 transition-all" style={{ '--tw-ring-color': 'var(--brand-primary)' } as any}>
              <Avatar className="h-full w-full">
                <AvatarImage src={user?.avatar_url} alt={user?.first_name || 'User'} className="object-cover" />
                <AvatarFallback className="text-white font-bold text-sm" style={{ backgroundColor: 'var(--brand-primary)' }}>
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-none rounded-xl">
            <DropdownMenuLabel className="p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <div 
                  className="mt-2 w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="rounded-lg cursor-pointer">
              <User className="mr-3 h-4 w-4 text-gray-500" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="rounded-lg cursor-pointer">
              <Settings className="mr-3 h-4 w-4 text-gray-500" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}