import { EmploymentStatus, EmploymentType } from './index'

export interface JobTitle {
  id: string
  title: string
  description?: string | null
}

export interface Employee {
  id: string
  employee_number: string
  first_name: string
  last_name: string
  email: string
  avatar_url?: string | null
  department?: { id: string; name: string } | null
  job_title?: { id: string; title: string } | null
  employment_status: EmploymentStatus
  employment_type: EmploymentType
  hire_date?: string | null
  base_salary?: number | null
  created_at: string
}

export function formatEmployeeName(e: Employee) {
  return `${e.first_name} ${e.last_name}`
}
