import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useDepartments() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDepartments()
  }, [])

  async function fetchDepartments() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name')

      if (error) throw error
      setDepartments(data || [])
    } catch (err) {
      console.error('Departments fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return { departments, loading, refetch: fetchDepartments }
}