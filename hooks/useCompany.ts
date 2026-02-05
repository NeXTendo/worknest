import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useCompany() {
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchCompany()
  }, [])

  async function fetchCompany() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

      if (profile?.company_id) {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single()

        if (error) throw error
        setCompany(data)
      }
    } catch (err) {
      console.error('Company fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return { company, loading, refetch: fetchCompany }
}