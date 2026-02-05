import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useLeave(status?: string) {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLeave()
  }, [status])

  async function fetchLeave() {
    try {
      setLoading(true)
      let query = supabase.from('leave_requests').select('*, employees(*)')
      
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      setLeaveRequests(data || [])
    } catch (err) {
      console.error('Leave fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return { leaveRequests, loading, refetch: fetchLeave }
}