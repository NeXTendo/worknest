import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { fetchRecord } from '@/lib/supabase/rpc-helpers'
import { Company } from '@/lib/database.types'

export function useCompany() {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchCompany = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await fetchRecord(supabase, 'profiles', user.id)
      
      if (profileError) {
        console.error('Profile fetch error:', profileError)
        return
      }

      if (profile && profile.company_id) {
        const { data: companyData, error: companyError } = await fetchRecord(supabase, 'companies', profile.company_id)
        
        if (companyError) {
          console.error('Company fetch error:', companyError)
          throw companyError
        }
        
        if (companyData) {
          setCompany(companyData as Company)
        }
      }
    } catch (err) {
      console.error('Company fetch exception:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompany()
  }, [])

  return { company, loading, refetch: fetchCompany }
}