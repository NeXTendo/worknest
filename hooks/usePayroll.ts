import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function usePayroll() {
  const [payroll, setPayroll] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPayroll()
  }, [])

  async function fetchPayroll() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payroll')
        .select('*, employees(*)')
        .order('pay_period', { ascending: false })

      if (error) throw error
      setPayroll(data || [])
    } catch (err) {
      console.error('Payroll fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return { payroll, loading, refetch: fetchPayroll }
}