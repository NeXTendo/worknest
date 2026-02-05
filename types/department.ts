export interface Department {
  id: string
  name: string
  description?: string | null
  employee_count: number
  budget?: number | null
  created_at: string
}

export type DepartmentSummary = Pick<Department, 'id' | 'name' | 'employee_count' | 'budget'>
