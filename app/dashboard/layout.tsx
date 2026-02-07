'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { useAuthStore } from '@/store/useAuthStore'
import { useCompanyStore } from '@/store/useCompanyStore'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

interface ProfileWithEmployee {
  id: string;
  role: string;
  company_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  employees: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const { setUser } = useAuthStore()
  const { setCompany, company } = useCompanyStore()
  const { sidebarOpen } = useUIStore()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    initializeDashboard()
  }, [])

  async function initializeDashboard() {
    try {
      setLoading(true)
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        router.push('/auth/login')
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          role,
          company_id,
          first_name,
          last_name,
          avatar_url,
          employees (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('id', session.user.id)
        .single()

      if (profileError || !profileData) {
        console.error('Profile load error:', profileError)
        router.push('/auth/login')
        return
      }

      const profile = profileData as unknown as ProfileWithEmployee

      setUser({
        id: profile.id,
        email: session.user.email!,
        role: profile.role as any,
        company_id: profile.company_id,
        employee_id: profile.employees?.id,
        first_name: profile.employees?.first_name || profile.first_name || '',
        last_name: profile.employees?.last_name || profile.last_name || '',
        avatar_url: profile.employees?.avatar_url || profile.avatar_url || '',
      })

      if (profile.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single()

        if (companyData && !companyError) {
          setCompany(companyData)
        }
      }

    } catch (error) {
      console.error('Initialization error:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (company) {
      const root = document.documentElement
      if (company.primary_color) {
        root.style.setProperty('--brand-primary', company.primary_color)
        root.style.setProperty('--brand-secondary', company.secondary_color || '#0F172A')
        root.style.setProperty('--brand-accent', company.accent_color || '#14B8A6')
      }
    }
  }, [company])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-worknest-teal"></div>
          <p className="text-gray-500 animate-pulse font-medium">WorkNest is preparing your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <AppSidebar />
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 min-w-0 h-screen",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto animate-fade-in pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}