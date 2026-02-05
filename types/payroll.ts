import { PayrollStatus } from './index'

export interface PayrollRecord {
  id: string
  employee_id: string
  period_start: string
  period_end: string
  gross_pay: number
  net_pay: number
  status: PayrollStatus
  created_at: string
  employee?: { id: string; first_name: string; last_name: string }
}

export type PayrollList = PayrollRecord[]
