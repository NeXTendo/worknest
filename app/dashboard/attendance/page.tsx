'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, QrCode, Download } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'

interface AttendanceRecord {
  id: string
  date: string
  time_in: string | null
  time_out: string | null
  status: string
  hours_worked: number | null
  employees: {
    first_name: string
    last_name: string
    employee_number: string
  }
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const supabase = createClient()

  useEffect(() => {
    fetchAttendance()
  }, [selectedDate])

  async function fetchAttendance() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          employees (first_name, last_name, employee_number)
        `)
        .eq('date', selectedDate)
        .order('time_in', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error('Attendance fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, any> = {
      present: 'success',
      absent: 'destructive',
      late: 'warning',
      half_day: 'secondary',
      on_leave: 'outline',
    }
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>
  }

  const presentCount = records.filter(r => r.status === 'present').length
  const lateCount = records.filter(r => r.status === 'late').length
  const absentCount = records.filter(r => r.status === 'absent').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
          <p className="text-slate-600 mt-1">Track employee attendance and work hours</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <QrCode className="mr-2 h-4 w-4" />
            QR Code
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Total Records</div>
            <div className="text-3xl font-bold mt-2">{records.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Present</div>
            <div className="text-3xl font-bold mt-2 text-worknest-emerald">{presentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Late</div>
            <div className="text-3xl font-bold mt-2 text-worknest-amber">{lateCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Absent</div>
            <div className="text-3xl font-bold mt-2 text-worknest-rose">{absentCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Date Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-md"
              placeholder="Select a date"
              title="Select attendance date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records - {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No attendance records for this date
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Employee</th>
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Time In</th>
                    <th className="text-left py-3 px-4">Time Out</th>
                    <th className="text-left py-3 px-4">Hours</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {record.employees.first_name} {record.employees.last_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">
                        {record.employees.employee_number}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.time_in ? formatTime(record.time_in) : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.time_out ? formatTime(record.time_out) : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.hours_worked ? `${record.hours_worked.toFixed(1)}h` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(record.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}