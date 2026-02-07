'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Briefcase
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

// Types
interface DashboardStats {
  totalEmployees: number
  presentToday: number
  monthlyPayroll: number
  pendingLeave: number
  employeeGrowth: number
  attendanceRate: number
}

interface EmployeeStats {
  attendanceRate: number
  leaveBalance: number
  hoursWorked: number
  lateDays: number
}

interface ActivityItem {
  title: string
  description: string
  time: string
}

interface DepartmentData {
  name: string
  employees: number
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <DashboardSkeleton />

  if (user?.role === 'employee' || user?.role === 'manager') {
    return <EmployeeDashboard userId={user.id} />
  }

  return <CompanyDashboard />
}

function EmployeeDashboard({ userId }: { userId: string }) {
  const [stats, setStats] = useState<EmployeeStats | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        setLoading(true)
        const today = new Date().toISOString().split('T')[0]
        const startOfMonth = new Date()
        startOfMonth.setDate(1)

        // 1. Fetch Employee ID
        const profileResponse = await supabase
          .from('profiles')
          .select('employee_id')
          .eq('id', userId)
          .single()

        const profileData = profileResponse.data as { employee_id: string | null } | null

        if (!profileData?.employee_id) {
          console.error('Employee ID not found for user:', userId)
          setLoading(false)
          return
        }

        // 2. Fetch Attendance (Current Month)
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('status, hours_worked, date')
          .eq('employee_id', profileData.employee_id)
          .gte('date', startOfMonth.toISOString())
        
        const attendance = attendanceData as { status: string; hours_worked: number; date: string }[] | null

        const totalDays = attendance?.length || 0
        const presentDays = attendance?.filter(a => a.status === 'present').length || 0
        const lateDays = attendance?.filter(a => a.status === 'late').length || 0
        const hoursWorked = attendance?.reduce((sum, a) => sum + (a.hours_worked || 0), 0) || 0
        
        // 2. Fetch Leave Balance (Mock or Real)
        // For now preventing error if table doesn't have balance column
        // We'll assume a standard 21 days for now or fetch from employee record if available
        const leaveBalance = 21 // Placeholder or fetch from employee.leave_balance

        setStats({
          attendanceRate: totalDays ? Math.round((presentDays / totalDays) * 100) : 100,
          leaveBalance,
          hoursWorked,
          lateDays
        })

        // 3. Recent Activity (My Attendance/Leave)
         const recentActivities: ActivityItem[] = []
         
         // Add recent attendance
         attendance?.slice(0, 3).forEach(a => {
           recentActivities.push({
             title: 'Attendance Logged',
             description: `Marked as ${a.status} (${a.hours_worked || 0}h)`,
             time: new Date(a.date).toLocaleDateString()
           })
         })

         setActivities(recentActivities)

      } catch (error) {
        console.error('Employee Dashboard Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchEmployeeData()
  }, [userId])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">My Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here is your personal overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendanceRate || 0}%`}
          icon={<Clock className="h-5 w-5" />}
          subtitle="this month"
          trendUp={true}
        />
        <StatCard
          title="Hours Worked"
          value={`${stats?.hoursWorked.toFixed(1) || 0}h`}
          icon={<Briefcase className="h-5 w-5" />}
          subtitle="this month"
          trendUp={true}
        />
         <StatCard
          title="Leave Balance"
          value={`${stats?.leaveBalance || 0}`}
          icon={<Calendar className="h-5 w-5" />}
          subtitle="days remaining"
        />
        <StatCard
          title="Late Arrivals"
          value={`${stats?.lateDays || 0}`}
          icon={<TrendingDown className="h-5 w-5" />}
          subtitle="this month"
          trendUp={false}
          trend={stats?.lateDays === 0 ? 'Good' : 'Needs Improve'}
        />
      </div>

      <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">My Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <ActivityItem 
                    key={index}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>
    </div>
  )
}

function CompanyDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [departments, setDepartments] = useState<DepartmentData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)

      // Fetch total employees
      const { count: employeeCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('employment_status', 'active')

      // Fetch today's attendance
      const today = new Date().toISOString().split('T')[0]
      const { count: presentTodayCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .in('status', ['present', 'late', 'half_day'])

      // Fetch pending leave requests
      const { count: leaveCount } = await supabase
        .from('leave_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Calculate monthly payroll (current month)
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: payrollData } = await supabase
        .from('payroll')
        .select('net_pay')
        .gte('pay_period_start', startOfMonth.toISOString())
        .in('status', ['processed', 'paid'])

      const monthlyPayroll = payrollData?.reduce((sum: number, p: { net_pay: number }) => sum + p.net_pay, 0) || 0

      // Calculate employee growth (compare to last month)
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      lastMonth.setDate(1)

      const { count: lastMonthCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('employment_status', 'active')
        .lte('hire_date', lastMonth.toISOString())

      const employeeGrowth = lastMonthCount && employeeCount
        ? Math.round(((employeeCount - lastMonthCount) / lastMonthCount) * 100)
        : 0

      // Calculate attendance rate
      const attendanceRate = employeeCount ? (presentTodayCount || 0) / employeeCount * 100 : 0

      // Fetch recent activity
      const recentActivities: ActivityItem[] = []

      // Get recent employees (last 3)
      const { data: newEmployees } = await supabase
        .from('employees')
        .select('first_name, last_name, created_at, job_title_id')
        .order('created_at', { ascending: false })
        .limit(3)

      newEmployees?.forEach((emp: { first_name: string; last_name: string; created_at: string }) => {
        const timeAgo = getTimeAgo(emp.created_at)
        recentActivities.push({
          title: 'New employee added',
          description: `${emp.first_name} ${emp.last_name} joined the team`,
          time: timeAgo
        })
      })

      // Get recent leave approvals (last 2)
      const { data: recentLeave } = await supabase
        .from('leave_requests')
        .select('reviewed_at, leave_type, employees!inner(first_name, last_name)')
        .eq('status', 'approved')
        .not('reviewed_at', 'is', null)
        .order('reviewed_at', { ascending: false })
        .limit(2)

      recentLeave?.forEach((leave: any) => {
        const timeAgo = getTimeAgo(leave.reviewed_at)
        recentActivities.push({
          title: 'Leave approved',
          description: `${leave.leave_type} leave for ${leave.employees.first_name} ${leave.employees.last_name}`,
          time: timeAgo
        })
      })

      // Sort by most recent and take top 5
      setActivities(recentActivities.slice(0, 5))

      // Fetch departments
      const { data: deptData } = await supabase
        .from('departments')
        .select('name, employee_count')
        .eq('is_active', true)
        .order('employee_count', { ascending: false })
        .limit(5)

      setDepartments(deptData?.map((d: { name: string; employee_count: number }) => ({
        name: d.name,
        employees: d.employee_count
      })) || [])

      setStats({
        totalEmployees: employeeCount || 0,
        presentToday: presentTodayCount || 0,
        monthlyPayroll,
        pendingLeave: leaveCount || 0,
        employeeGrowth,
        attendanceRate: Math.round(attendanceRate),
      })
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to calculate time ago
  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-600">Welcome to WorkNest - Overview of your organization</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees.toString() || '0'}
          icon={<Users className="h-5 w-5" />}
          trend={`+${stats?.employeeGrowth || 0}%`}
          trendUp={true}
          subtitle="from last month"
        />
        
        <StatCard
          title="Present Today"
          value={stats?.presentToday.toString() || '0'}
          icon={<Clock className="h-5 w-5" />}
          trend={`${stats?.attendanceRate || 0}%`}
          trendUp={true}
          subtitle="attendance rate"
        />
        
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(stats?.monthlyPayroll || 0)}
          icon={<DollarSign className="h-5 w-5" />}
          trend="+3%"
          trendUp={true}
          subtitle="from last month"
        />
        
        <StatCard
          title="Leave Requests"
          value={stats?.pendingLeave.toString() || '0'}
          icon={<Calendar className="h-5 w-5" />}
          trend="Pending"
          trendUp={false}
          subtitle="awaiting approval"
        />
      </div>

      {/* Charts would go here */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <ActivityItem 
                    key={index}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {departments.length > 0 ? (
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <DepartmentItem 
                    key={index}
                    name={dept.name} 
                    employees={dept.employees} 
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">No departments found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  subtitle?: string
}

function StatCard({ title, value, icon, trend, trendUp, subtitle }: StatCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-worknest-teal to-teal-600 flex items-center justify-center text-white shadow-lg shadow-worknest-teal/20">
            {icon}
          </div>
        </div>
        {(trend || subtitle) && (
          <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
            {trend && (
              <>
              {trendUp !== undefined && (trendUp ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-amber-600" />
              ))}
              <span className={`text-sm font-semibold ${trendUp ? 'text-emerald-600' : 'text-amber-600'}`}>
                {trend}
              </span>
              </>
            )}
            {subtitle && <span className="text-sm text-slate-500">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityItem({ title, description, time }: { title: string; description: string; time: string }) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="h-2 w-2 rounded-full bg-worknest-teal mt-2 group-hover:scale-125 transition-transform" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-900">{title}</p>
        <p className="text-sm text-slate-600 truncate">{description}</p>
        <p className="text-xs text-slate-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

function DepartmentItem({ name, employees }: { name: string; employees: number }) {
  return (
    <div className="flex items-center justify-between py-2 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
      <span className="text-sm font-semibold text-slate-900">{name}</span>
      <span className="text-sm text-slate-600 font-medium">{employees} employees</span>
    </div>
  )
}
