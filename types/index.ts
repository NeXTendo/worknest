export type UserRole = 'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'

export type EmploymentStatus = 'active' | 'on_leave' | 'suspended' | 'terminated' | 'pending'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'compassionate'
export type PayrollStatus = 'draft' | 'processing' | 'processed' | 'paid' | 'failed'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'

export interface Database {
  public: {
    Tables: {
      companies: any
      profiles: any
      employees: any
      departments: any
      job_titles: any
      attendance: any
      leave_requests: any
      payroll: any
      announcements: any
      qr_codes: any
      audit_logs: any
    }
  }
}
