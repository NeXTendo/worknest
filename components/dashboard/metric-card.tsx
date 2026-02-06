'use client'

import { Card, CardContent } from '@/components/ui/card'

interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: string
}

export function MetricCard({ label, value, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && <p className="text-sm text-green-600">{trend}</p>}
          </div>
          <div className="text-teal-500">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
