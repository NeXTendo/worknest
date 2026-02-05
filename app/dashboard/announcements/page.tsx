'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Megaphone, Plus } from 'lucide-react'

export default function AnnouncementsPage() {
  const announcements = [
    { id: 1, title: 'Company Holiday Notice', content: 'Office will be closed on March 20th', priority: 'high', date: '2024-03-01' },
    { id: 2, title: 'New HR Policies', content: 'Updated employee handbook available', priority: 'normal', date: '2024-02-28' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-gray-600 mt-1">Company-wide communications</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />New Announcement</Button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-worknest-teal/10 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="h-6 w-6 text-worknest-teal" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{ann.title}</h3>
                      {ann.priority === 'high' && <Badge variant="destructive">Important</Badge>}
                    </div>
                    <p className="text-gray-600">{ann.content}</p>
                    <p className="text-sm text-gray-400 mt-2">{ann.date}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
