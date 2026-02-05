# WorkNest Implementation Guide
## Complete Code Examples & Patterns

This document provides detailed code examples for implementing WorkNest components and features.

---

## 🎨 COMPONENT EXAMPLES

### 1. App Layout Component

**File: `components/layout/app-sidebar.tsx`**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'
import { useCompanyStore } from '@/store/useCompanyStore'
import { useUIStore } from '@/store/useUIStore'
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  DollarSign,
  Calendar,
  Megaphone,
  Settings,
  UserCog,
  ChevronLeft,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
  {
    title: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager'],
  },
  {
    title: 'Departments',
    href: '/dashboard/departments',
    icon: Building2,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager'],
  },
  {
    title: 'Attendance',
    href: '/dashboard/attendance',
    icon: ClipboardList,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
  {
    title: 'Payroll',
    href: '/dashboard/payroll',
    icon: DollarSign,
    roles: ['super_admin', 'main_admin', 'hr_admin'],
  },
  {
    title: 'Leave',
    href: '/dashboard/leave',
    icon: Calendar,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
  {
    title: 'Announcements',
    href: '/dashboard/announcements',
    icon: Megaphone,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: UserCog,
    roles: ['super_admin', 'main_admin'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['super_admin', 'main_admin'],
  },
  {
    title: 'About',
    href: '/dashboard/about',
    icon: Info,
    roles: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { company } = useCompanyStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  const filteredNav = navigation.filter(item => 
    user?.role && item.roles.includes(user.role)
  )

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-worknest-navy text-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo & Company */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
          {company?.logo_url ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={company.logo_url} alt={company.name} />
              <AvatarFallback style={{ backgroundColor: company.primary_color }}>
                {company.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: company?.primary_color || '#14B8A6' }}
            >
              WN
            </div>
          )}
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-sm">{company?.name || 'WorkNest'}</span>
              <span className="text-xs text-white/60 capitalize">{user?.role?.replace('_', ' ')}</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft className={cn('h-5 w-5 transition-transform', !sidebarOpen && 'rotate-180')} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-worknest-teal text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
                !sidebarOpen && 'justify-center'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className={cn('text-xs text-white/50', !sidebarOpen && 'text-center')}>
          {sidebarOpen ? (
            <>
              <p>Powered by <span className="text-worknest-teal font-medium">TechOhns</span></p>
              <p className="mt-1">© 2024 All rights reserved</p>
            </>
          ) : (
            <p>TechOhns</p>
          )}
        </div>
      </div>
    </aside>
  )
}
```

---

### 2. App Header Component

**File: `components/layout/app-header.tsx`**

```tsx
'use client'

import { Bell, Search, User, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useCompanyStore } from '@/store/useCompanyStore'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AppHeader() {
  const { user, logout } = useAuthStore()
  const { company } = useCompanyStore()
  const { sidebarOpen } = useUIStore()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    logout()
    router.push('/auth/login')
  }

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`
    }
    return 'WN'
  }

  return (
    <header
      className={cn(
        'sticky-header flex h-16 items-center justify-between border-b px-6 transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-20'
      )}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees, departments..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-worknest-rose" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url} alt={user?.first_name || 'User'} />
                <AvatarFallback style={{ backgroundColor: company?.primary_color }}>
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-worknest-teal capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              <User className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
```

---

### 3. Data Table Component (using TanStack Table)

**File: `components/shared/data-table.tsx`**

```tsx
'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  isLoading?: boolean
  pageSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  isLoading = false,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

### 4. Employee Table with Columns

**File: `app/(dashboard)/employees/page.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatEnumValue } from '@/lib/utils'
import { useUIStore } from '@/store/useUIStore'
import { EmployeeDrawer } from '@/components/employees/employee-drawer'

interface Employee {
  id: string
  employee_number: string
  first_name: string
  last_name: string
  email: string
  avatar_url: string | null
  employment_status: string
  employment_type: string
  hire_date: string
  department: {
    name: string
  } | null
  job_title: {
    title: string
  } | null
}

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'employee_number',
    header: 'ID',
  },
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => {
      const employee = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={employee.avatar_url || undefined} />
            <AvatarFallback>
              {employee.first_name[0]}{employee.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {employee.first_name} {employee.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{employee.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'job_title.title',
    header: 'Job Title',
    cell: ({ row }) => row.original.job_title?.title || 'N/A',
  },
  {
    accessorKey: 'department.name',
    header: 'Department',
    cell: ({ row }) => row.original.department?.name || 'N/A',
  },
  {
    accessorKey: 'employment_type',
    header: 'Type',
    cell: ({ row }) => formatEnumValue(row.getValue('employment_type')),
  },
  {
    accessorKey: 'employment_status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('employment_status') as string
      const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        active: 'default',
        on_leave: 'secondary',
        suspended: 'outline',
        terminated: 'destructive',
      }
      return (
        <Badge variant={variants[status] || 'default'}>
          {formatEnumValue(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'hire_date',
    header: 'Date Started',
    cell: ({ row }) => formatDate(row.getValue('hire_date')),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const employee = row.original
      const { openDrawer } = useUIStore()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openDrawer(<EmployeeDrawer employeeId={employee.id} />)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchEmployees() {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          department:departments(name),
          job_title:job_titles(title)
        `)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setEmployees(data as Employee[])
      }
      setIsLoading(false)
    }

    fetchEmployees()
  }, [supabase])

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">
            Manage your workforce and employee data
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        searchKey="employee_number"
        searchPlaceholder="Search employees..."
        isLoading={isLoading}
      />
    </div>
  )
}
```

---

## 🔧 API IMPLEMENTATION EXAMPLES

### Server Action for Employee Creation

**File: `app/(dashboard)/employees/actions.ts`**

```typescript
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { generateEmployeeId, generateDefaultPassword } from '@/lib/utils'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface CreateEmployeeInput {
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  department_id: string
  job_title_id: string
  employment_type: string
  hire_date: string
  base_salary: number
  // ... other fields
}

export async function createEmployee(input: CreateEmployeeInput) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get current user and company
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!profile) throw new Error('Profile not found')

    // Generate employee number
    const { count } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', profile.company_id)

    const employee_number = generateEmployeeId(count || 0)

    // Generate default password
    const defaultPassword = generateDefaultPassword(input.date_of_birth)

    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: input.email,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: {
        first_name: input.first_name,
        last_name: input.last_name,
      },
    })

    if (authError) throw authError

    // Create profile
    await supabase.from('profiles').insert({
      id: authUser.user.id,
      company_id: profile.company_id,
      role: 'employee',
      employee_id: employee_number,
      email: input.email,
      first_name: input.first_name,
      last_name: input.last_name,
      must_change_password: true,
    })

    // Create employee record
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        company_id: profile.company_id,
        user_id: authUser.user.id,
        employee_number,
        ...input,
      })
      .select()
      .single()

    if (employeeError) throw employeeError

    // Send welcome email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: input.email,
      subject: 'Welcome to WorkNest',
      html: `
        <h1>Welcome ${input.first_name}!</h1>
        <p>Your employee account has been created.</p>
        <p><strong>Login Details:</strong></p>
        <ul>
          <li>Employee ID: ${employee_number}</li>
          <li>Email: ${input.email}</li>
          <li>Default Password: ${defaultPassword}</li>
        </ul>
        <p>Please change your password after first login.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login">Login Now</a>
      `,
    })

    revalidatePath('/dashboard/employees')
    
    return { success: true, employee }
  } catch (error) {
    console.error('Error creating employee:', error)
    return { success: false, error: 'Failed to create employee' }
  }
}
```

---

## 📊 DASHBOARD CHARTS

**File: `components/dashboard/attendance-chart.tsx`**

```tsx
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
```

---

## 🎯 QR CODE GENERATION

**File: `lib/qr/generator.ts`**

```typescript
import QRCode from 'qrcode'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function generateAttendanceQR(companyId: string): Promise<string> {
  const supabase = createServerSupabaseClient()
  
  // Create unique code
  const code = `${companyId}-${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Set validity period (8 hours)
  const validFrom = new Date()
  const validUntil = new Date(validFrom.getTime() + 8 * 60 * 60 * 1000)
  
  // Save to database
  await supabase.from('qr_codes').insert({
    company_id: companyId,
    code,
    type: 'attendance',
    valid_from: validFrom.toISOString(),
    valid_until: validUntil.toISOString(),
    is_active: true,
  })
  
  // Generate QR code as data URL
  const qrCodeDataURL = await QRCode.toDataURL(code, {
    width: 400,
    margin: 2,
    color: {
      dark: '#14B8A6',
      light: '#FFFFFF',
    },
  })
  
  return qrCodeDataURL
}

export async function validateQRCode(code: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single()
  
  if (error || !data) return false
  
  const now = new Date()
  const validFrom = new Date(data.valid_from)
  const validUntil = new Date(data.valid_until)
  
  return now >= validFrom && now <= validUntil
}
```

This implementation guide provides production-ready code examples for the WorkNest system. All components follow best practices and are fully typed with TypeScript.
