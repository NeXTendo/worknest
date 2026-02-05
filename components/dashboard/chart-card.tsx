'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  children: React.ReactNode
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
EOF

cat > /home/claude/components/dashboard/metric-card.tsx << 'EOF'
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
