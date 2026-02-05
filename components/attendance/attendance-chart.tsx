'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface AttendanceChartProps {
  data: Array<{
    date: string
    present: number
    absent: number
    late: number
  }>
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="present"
              stroke="#10B981"
              strokeWidth={2}
              name="Present"
            />
            <Line
              type="monotone"
              dataKey="absent"
              stroke="#F43F5E"
              strokeWidth={2}
              name="Absent"
            />
            <Line
              type="monotone"
              dataKey="late"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Late"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}