'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, Users, Plus } from 'lucide-react'

interface Department {
  id: string
  name: string
  description: string | null
  employee_count: number
  budget: number | null
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDepartments()
  }, [])

  async function fetchDepartments() {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name')

      if (error) throw error
      setDepartments(data || [])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-gray-600 mt-1">Organize your teams and departments</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Add Department</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-worknest-teal/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-worknest-teal" />
                </div>
                <div>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <p className="text-sm text-gray-500">{dept.employee_count} employees</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{dept.description || 'No description'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
