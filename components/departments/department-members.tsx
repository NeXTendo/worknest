'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, Phone, User } from 'lucide-react'

interface Member {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  job_titles: { title: string } | null
}

export function DepartmentMembers({ departmentId }: { departmentId: string }) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchMembers()
  }, [departmentId])

  async function fetchMembers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          avatar_url,
          job_titles (title)
        `)
        .eq('department_id', departmentId)
        .eq('is_active', true)

      if (error) throw error
      setMembers(data as any || [])
    } catch (error) {
      console.error('Error fetching department members:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
        No members found in this department.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {members.map((member) => (
        <div 
          key={member.id}
          className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-worknest-teal/30 hover:bg-worknest-teal/5 transition-all group"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src={member.avatar_url || ''} />
              <AvatarFallback className="bg-worknest-teal/10 text-worknest-teal font-medium">
                {member.first_name[0]}{member.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-worknest-teal transition-colors">
                {member.first_name} {member.last_name}
              </p>
              <p className="text-xs text-slate-500 font-medium capitalize">
                {member.job_titles?.title || 'No Title'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {member.email && (
              <a 
                href={`mailto:${member.email}`}
                className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-worknest-teal transition-colors"
                title={member.email}
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
            {member.phone && (
              <a 
                href={`tel:${member.phone}`}
                className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-worknest-teal transition-colors"
                title={member.phone}
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
