import { LeaveType, LeaveStatus } from './index'

export interface LeaveRequest {
  id: string
  employee_id: string
  type: LeaveType
  status: LeaveStatus
  from_date: string
  to_date: string
  days: number
  reason?: string | null
  created_at: string
  employee?: { id: string; first_name: string; last_name: string }
}

export type LeaveList = LeaveRequest[]
