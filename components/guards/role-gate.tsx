'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RoleGateProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
}

export function RoleGate({ children, allowedRoles, fallback }: RoleGateProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkRole()
  }, [])

  async function checkRole() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setHasAccess(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setHasAccess(profile && allowedRoles.includes(profile.role))
    } catch (error) {
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null
  if (!hasAccess) return fallback || null
  return <>{children}</>
}
