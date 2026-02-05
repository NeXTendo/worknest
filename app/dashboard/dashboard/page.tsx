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
  TrendingDown
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalEmployees: number
  presentToday: number
  monthlyPayroll: number
  pendingLeave: number
  employeeGrowth: number
  attendanceRate: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
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
      const { count: presentCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('status', 'present')

      // Fetch pending leave requests
      const { count: leaveCount } = await supabase
        .from('leave_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Calculate attendance rate
      const attendanceRate = employeeCount ? (presentCount || 0) / employeeCount * 100 : 0

      setStats({
        totalEmployees: employeeCount || 0,
        presentToday: presentCount || 0,
        monthlyPayroll: 450000, // This would come from payroll table
        pendingLeave: leaveCount || 0,
        employeeGrowth: 0, // Calculated from historical data
        attendanceRate: Math.round(attendanceRate),
      })
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-worknest-text">Dashboard</h1>
        <p className="text-worknest-muted mt-1">Welcome to WorkNest - Overview of your organization</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem 
                title="New employee added"
                description="John Doe joined as Software Engineer"
                time="2 hours ago"
              />
              <ActivityItem 
                title="Leave approved"
                description="Annual leave for Jane Smith approved"
                time="5 hours ago"
              />
              <ActivityItem 
                title="Payroll processed"
                description="January payroll completed successfully"
                time="1 day ago"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <DepartmentItem name="Engineering" employees={45} />
              <DepartmentItem name="Sales" employees={28} />
              <DepartmentItem name="Marketing" employees={15} />
              <DepartmentItem name="HR" employees={8} />
              <DepartmentItem name="Finance" employees={12} />
            </div>
          </CardContent>
        </Card>
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
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="h-10 w-10 rounded-lg bg-worknest-teal/10 flex items-center justify-center text-worknest-teal">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              {trendUp ? (
                <TrendingUp className="h-4 w-4 text-worknest-emerald" />
              ) : (
                <TrendingDown className="h-4 w-4 text-worknest-amber" />
              )}
              <span className={`text-sm font-medium ${trendUp ? 'text-worknest-emerald' : 'text-worknest-amber'}`}>
                {trend}
              </span>
              {subtitle && <span className="text-sm text-gray-500 ml-1">{subtitle}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ title, description, time }: { title: string; description: string; time: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-2 w-2 rounded-full bg-worknest-teal mt-2" />
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

function DepartmentItem({ name, employees }: { name: string; employees: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{name}</span>
      <span className="text-sm text-gray-500">{employees} employees</span>
    </div>
  )
}
