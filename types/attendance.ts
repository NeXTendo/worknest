import { AttendanceStatus } from './index'

export interface AttendanceRecord {
  id: string
  employee_id: string
  date: string
  time_in?: string | null
  time_out?: string | null
  status: AttendanceStatus
  hours_worked?: number | null
  created_at: string
  employees?: {
    first_name: string
    last_name: string
    employee_number: string
  }
}

export type AttendanceList = AttendanceRecord[]
