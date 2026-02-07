'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Megaphone, Calendar, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Announcement } from '@/lib/database.types'
import CreateAnnouncementDialog from './components/CreateAnnouncementDialog'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchAnnouncements()
    }
  }, [user])

  async function fetchAnnouncements() {
    try {
      setLoading(true)
      let query = supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false })

      // Filter by company for non-super admins
      if (user?.role !== 'super_admin' && user?.company_id) {
        query = query.eq('company_id', user.company_id)
      }

      const { data, error } = await query

      if (error) throw error
      setAnnouncements(data || [])
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  function getPriorityBadge(priority: string) {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
      case 'low':
        return <Badge variant="secondary">Low</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Announcements</h1>
          <p className="text-slate-600 mt-1">Company-wide communications and updates</p>
        </div>
        
        {/* Only show create button for admins */}
        {user?.role !== 'employee' && (
          <CreateAnnouncementDialog onAnnouncementCreated={fetchAnnouncements} />
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))
        ) : announcements.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Megaphone className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No announcements yet</h3>
              <p className="text-slate-500 max-w-sm mt-1">
                When new announcements are posted, they will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((ann) => (
            <Card key={ann.id} className={`transition-all hover:shadow-md ${ann.is_pinned ? 'border-worknest-teal/50 bg-worknest-teal/5' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    ann.priority === 'critical' ? 'bg-red-100 text-red-600' : 
                    ann.priority === 'high' ? 'bg-orange-100 text-orange-600' : 
                    'bg-worknest-teal/10 text-worknest-teal'
                  }`}>
                    {ann.priority === 'critical' ? <AlertCircle className="h-6 w-6" /> : <Megaphone className="h-6 w-6" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-lg text-slate-900">{ann.title}</h3>
                      {getPriorityBadge(ann.priority)}
                      {ann.is_pinned && <Badge variant="outline" className="border-worknest-teal text-worknest-teal">Pinned</Badge>}
                    </div>
                    
                    <p className="text-slate-600 whitespace-pre-wrap mb-3">{ann.content}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(ann.published_at), 'MMM d, yyyy')}</span>
                      </div>
                      {ann.company_id && user?.role === 'super_admin' && (
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                           Company ID: {ann.company_id.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
