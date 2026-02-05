import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAttendance(date?: string) {
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAttendance()
  }, [date])

  async function fetchAttendance() {
    try {
      setLoading(true)
      let query = supabase.from('attendance').select('*, employees(*)')
      
      if (date) {
        query = query.eq('date', date)
      }

      const { data, error } = await query.order('check_in', { ascending: false })
      if (error) throw error
      setAttendance(data || [])
    } catch (err) {
      console.error('Attendance fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return { attendance, loading, refetch: fetchAttendance }
}