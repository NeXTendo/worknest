'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, QrCode, Download, Scan, Settings2, BarChart3, Loader2 } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QRGeneratorForm } from './components/QRGeneratorForm'
import { QRScanner } from './components/QRScanner'
import { ActiveQRList } from './components/ActiveQRList'
import { useAuthStore } from '@/store/useAuthStore'

interface AttendanceRecord {
  id: string
  date: string
  time_in: string | null
  time_out: string | null
  status: string
  hours_worked: number | null
  overtime_hours: number | null
  late_by_minutes: number | null
  location: string | null
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
  const { user } = useAuthStore()
  const supabase = createClient()
  
  const isAdmin = user?.role === 'super_admin' || user?.role === 'main_admin' || user?.role === 'hr_admin'

  useEffect(() => {
    fetchAttendance()
  }, [selectedDate])

  async function fetchAttendance() {
    try {
      setLoading(true)
      
      let query = supabase
        .from('attendance')
        .select(`
          *,
          employees (first_name, last_name, employee_number)
        `)
        .eq('date', selectedDate)
        .order('time_in', { ascending: false })

      // If not admin, restrict to own records
      if (!isAdmin && user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('employee_id')
          .eq('id', user.id)
          .single()
        
        const profile = profileData as { employee_id: string } | null
        
        if (profile?.employee_id) {
          query = query.eq('employee_id', profile.employee_id)
        }
      }

      const { data, error } = await query

      if (error) throw error
      
      // Cast to avoid type errors
      setRecords((data || []) as any[])
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
    return <Badge variant={variants[status]}>{status?.toUpperCase() || 'UNKNOWN'}</Badge>
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
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white p-1 rounded-xl border">
          <TabsTrigger value="overview" className="rounded-lg px-6">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="scan" className="rounded-lg px-6">
            <Scan className="mr-2 h-4 w-4" />
            Scan QR
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="manage" className="rounded-lg px-6">
              <Settings2 className="mr-2 h-4 w-4" />
              Manage QR
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-slate-500">Total Records</div>
                <div className="text-3xl font-bold mt-2 text-slate-900">{records.length}</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-slate-500">Present</div>
                <div className="text-3xl font-bold mt-2 text-worknest-emerald">{presentCount}</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-slate-500">Late</div>
                <div className="text-3xl font-bold mt-2 text-worknest-amber">{lateCount}</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-slate-500">Absent</div>
                <div className="text-3xl font-bold mt-2 text-worknest-rose">{absentCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Date Selector */}
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-worknest-teal" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Viewing Attendance For</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-sm font-semibold bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                    title="Select attendance date"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-800">Records - {formatDate(selectedDate)}</CardTitle>
                <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs font-bold border-slate-200">
                  <Download className="mr-2 h-3 w-3" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-20 flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-worknest-teal" />
                  <span className="text-slate-400 font-medium">Loading records...</span>
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium">
                  No attendance records found for this date.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50/30">
                        <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500">Employee</th>
                        <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500">Time In</th>
                        <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500">Time Out</th>
                        <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500">Late</th>
                        <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500">Overtime</th>
                        <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500">Hours</th>
                        <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800">{record.employees.first_name} {record.employees.last_name}</span>
                              <span className="text-[10px] font-mono text-slate-400">{record.employees.employee_number}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-slate-600">
                            {record.time_in ? formatTime(record.time_in) : '-'}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-slate-600">
                            {record.time_out ? formatTime(record.time_out) : '-'}
                          </td>
                          <td className="py-4 px-6">
                            {record.late_by_minutes && record.late_by_minutes > 0 ? (
                              <span className="text-[11px] font-bold text-worknest-amber bg-worknest-amber/10 px-2 py-0.5 rounded-full">
                                {record.late_by_minutes}m late
                              </span>
                            ) : '-'}
                          </td>
                          <td className="py-4 px-6">
                            {record.overtime_hours && record.overtime_hours > 0 ? (
                              <span className="text-[11px] font-bold text-worknest-emerald bg-worknest-emerald/10 px-2 py-0.5 rounded-full">
                                +{record.overtime_hours.toFixed(1)}h OT
                              </span>
                            ) : '-'}
                          </td>
                          <td className="py-4 px-6 text-sm font-bold text-slate-700">
                            {record.hours_worked ? `${record.hours_worked.toFixed(1)}h` : '-'}
                          </td>
                          <td className="py-4 px-6">
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
        </TabsContent>

        <TabsContent value="scan">
           <div className="max-w-xl mx-auto space-y-4">
             <div className="text-center mb-8">
               <h2 className="text-2xl font-bold mb-2">Scan Attendance</h2>
               <p className="text-gray-600">Use your camera to scan the company QR code to check in or out.</p>
             </div>
             <QRScanner />
           </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="manage">
             <div className="max-w-4xl mx-auto space-y-6">
                <QRGeneratorForm />
                <ActiveQRList />
             </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}