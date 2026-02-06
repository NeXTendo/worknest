// types/database.types.ts
// Complete type definitions for WorkNest database
// Generated to work with Supabase dynamic RPC functions

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// ENUMS
// ============================================================================

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
export type EmploymentStatus = 'active' | 'on_leave' | 'suspended' | 'terminated' | 'pending'
export type UserRole = 'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'compassionate'
export type PayrollStatus = 'draft' | 'processing' | 'processed' | 'paid' | 'failed'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company
        Insert: CompanyInsert
        Update: CompanyUpdate
      }
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      departments: {
        Row: Department
        Insert: DepartmentInsert
        Update: DepartmentUpdate
      }
      job_titles: {
        Row: JobTitle
        Insert: JobTitleInsert
        Update: JobTitleUpdate
      }
      employees: {
        Row: Employee
        Insert: EmployeeInsert
        Update: EmployeeUpdate
      }
      attendance: {
        Row: Attendance
        Insert: AttendanceInsert
        Update: AttendanceUpdate
      }
      leave_requests: {
        Row: LeaveRequest
        Insert: LeaveRequestInsert
        Update: LeaveRequestUpdate
      }
      payroll: {
        Row: Payroll
        Insert: PayrollInsert
        Update: PayrollUpdate
      }
      announcements: {
        Row: Announcement
        Insert: AnnouncementInsert
        Update: AnnouncementUpdate
      }
      qr_codes: {
        Row: QRCode
        Insert: QRCodeInsert
        Update: QRCodeUpdate
      }
      audit_logs: {
        Row: AuditLog
        Insert: AuditLogInsert
        Update: AuditLogUpdate
      }
    }
    Functions: {
      insert_record: {
        Args: {
          p_table_name: string
          p_data: Json
        }
        Returns: string
      }
      update_record: {
        Args: {
          p_table_name: string
          p_record_id: string
          p_updates: Json
        }
        Returns: string
      }
      delete_record: {
        Args: {
          p_table_name: string
          p_id: string
        }
        Returns: void
      }
      jwt_company_id: {
        Args: Record<string, never>
        Returns: string
      }
      jwt_role: {
        Args: Record<string, never>
        Returns: string
      }
      jwt_user_id: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      employment_type: EmploymentType
      employment_status: EmploymentStatus
      user_role: UserRole
      leave_status: LeaveStatus
      leave_type: LeaveType
      payroll_status: PayrollStatus
      attendance_status: AttendanceStatus
    }
    Views: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// ============================================================================
// COMPANY TYPES
// ============================================================================

export interface Company {
  id: string
  name: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  website: string | null
  industry: string | null
  employee_count: number
  address: string | null
  city: string | null
  country: string
  phone: string | null
  email: string | null
  registration_number: string | null
  tax_id: string | null
  is_active: boolean
  settings: Json
  created_at: string
  updated_at: string
}

export interface CompanyInsert {
  id?: string
  name: string
  logo_url?: string | null
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  website?: string | null
  industry?: string | null
  employee_count?: number
  address?: string | null
  city?: string | null
  country?: string
  phone?: string | null
  email?: string | null
  registration_number?: string | null
  tax_id?: string | null
  is_active?: boolean
  settings?: Json
  created_at?: string
  updated_at?: string
}

export interface CompanyUpdate {
  id?: string
  name?: string
  logo_url?: string | null
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  website?: string | null
  industry?: string | null
  employee_count?: number
  address?: string | null
  city?: string | null
  country?: string
  phone?: string | null
  email?: string | null
  registration_number?: string | null
  tax_id?: string | null
  is_active?: boolean
  settings?: Json
  created_at?: string
  updated_at?: string
}

// ============================================================================
// PROFILE TYPES
// ============================================================================

export interface Profile {
  id: string
  company_id: string | null
  role: UserRole
  employee_id: string | null
  username: string | null
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  date_of_birth: string | null
  gender: string | null
  must_change_password: boolean
  is_active: boolean
  last_login: string | null
  preferences: Json
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id: string
  company_id?: string | null
  role?: UserRole
  employee_id?: string | null
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  email: string
  phone?: string | null
  avatar_url?: string | null
  date_of_birth?: string | null
  gender?: string | null
  must_change_password?: boolean
  is_active?: boolean
  last_login?: string | null
  preferences?: Json
  created_at?: string
  updated_at?: string
}

export interface ProfileUpdate {
  id?: string
  company_id?: string | null
  role?: UserRole
  employee_id?: string | null
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  email?: string
  phone?: string | null
  avatar_url?: string | null
  date_of_birth?: string | null
  gender?: string | null
  must_change_password?: boolean
  is_active?: boolean
  last_login?: string | null
  preferences?: Json
  created_at?: string
  updated_at?: string
}

// ============================================================================
// DEPARTMENT TYPES
// ============================================================================

export interface Department {
  id: string
  company_id: string
  name: string
  description: string | null
  manager_id: string | null
  budget: number | null
  employee_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DepartmentInsert {
  id?: string
  company_id?: string
  name: string
  description?: string | null
  manager_id?: string | null
  budget?: number | null
  employee_count?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface DepartmentUpdate {
  id?: string
  company_id?: string
  name?: string
  description?: string | null
  manager_id?: string | null
  budget?: number | null
  employee_count?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// ============================================================================
// JOB TITLE TYPES
// ============================================================================

export interface JobTitle {
  id: string
  company_id: string
  department_id: string | null
  title: string
  description: string | null
  level: string | null
  base_salary: number | null
  requirements: string[] | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface JobTitleInsert {
  id?: string
  company_id?: string
  department_id?: string | null
  title: string
  description?: string | null
  level?: string | null
  base_salary?: number | null
  requirements?: string[] | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface JobTitleUpdate {
  id?: string
  company_id?: string
  department_id?: string | null
  title?: string
  description?: string | null
  level?: string | null
  base_salary?: number | null
  requirements?: string[] | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// ============================================================================
// EMPLOYEE TYPES
// ============================================================================

export interface Employee {
  id: string
  company_id: string
  user_id: string | null
  employee_number: string
  department_id: string | null
  job_title_id: string | null
  manager_id: string | null
  first_name: string
  middle_name: string | null
  last_name: string
  email: string
  phone: string | null
  alternate_phone: string | null
  date_of_birth: string | null
  gender: string | null
  nationality: string
  national_id: string | null
  passport_number: string | null
  avatar_url: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  state_province: string | null
  postal_code: string | null
  country: string
  emergency_contact_name: string | null
  emergency_contact_relationship: string | null
  emergency_contact_phone: string | null
  emergency_contact_address: string | null
  employment_type: EmploymentType
  employment_status: EmploymentStatus
  hire_date: string
  contract_start_date: string | null
  contract_end_date: string | null
  probation_end_date: string | null
  termination_date: string | null
  termination_reason: string | null
  bank_name: string | null
  bank_account_number: string | null
  bank_account_name: string | null
  bank_branch: string | null
  bank_swift_code: string | null
  health_insurance_provider: string | null
  health_insurance_number: string | null
  health_insurance_expiry: string | null
  pension_number: string | null
  social_security_number: string | null
  base_salary: number | null
  currency: string
  pay_frequency: string
  tax_number: string | null
  notes: string | null
  skills: string[] | null
  certifications: Json
  documents: Json
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmployeeInsert {
  id?: string
  company_id?: string
  user_id?: string | null
  employee_number: string
  department_id?: string | null
  job_title_id?: string | null
  manager_id?: string | null
  first_name: string
  middle_name?: string | null
  last_name: string
  email: string
  phone?: string | null
  alternate_phone?: string | null
  date_of_birth?: string | null
  gender?: string | null
  nationality?: string
  national_id?: string | null
  passport_number?: string | null
  avatar_url?: string | null
  address_line_1?: string | null
  address_line_2?: string | null
  city?: string | null
  state_province?: string | null
  postal_code?: string | null
  country?: string
  emergency_contact_name?: string | null
  emergency_contact_relationship?: string | null
  emergency_contact_phone?: string | null
  emergency_contact_address?: string | null
  employment_type?: EmploymentType
  employment_status?: EmploymentStatus
  hire_date: string
  contract_start_date?: string | null
  contract_end_date?: string | null
  probation_end_date?: string | null
  termination_date?: string | null
  termination_reason?: string | null
  bank_name?: string | null
  bank_account_number?: string | null
  bank_account_name?: string | null
  bank_branch?: string | null
  bank_swift_code?: string | null
  health_insurance_provider?: string | null
  health_insurance_number?: string | null
  health_insurance_expiry?: string | null
  pension_number?: string | null
  social_security_number?: string | null
  base_salary?: number | null
  currency?: string
  pay_frequency?: string
  tax_number?: string | null
  notes?: string | null
  skills?: string[] | null
  certifications?: Json
  documents?: Json
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface EmployeeUpdate extends Partial<EmployeeInsert> {}

// ============================================================================
// ATTENDANCE TYPES
// ============================================================================

export interface Attendance {
  id: string
  company_id: string
  employee_id: string
  date: string
  time_in: string | null
  time_out: string | null
  status: AttendanceStatus
  hours_worked: number | null
  overtime_hours: number
  late_by_minutes: number
  location: string | null
  ip_address: string | null
  notes: string | null
  verified_by: string | null
  created_at: string
  updated_at: string
}

export interface AttendanceInsert {
  id?: string
  company_id?: string
  employee_id: string
  date: string
  time_in?: string | null
  time_out?: string | null
  status?: AttendanceStatus
  hours_worked?: number | null
  overtime_hours?: number
  late_by_minutes?: number
  location?: string | null
  ip_address?: string | null
  notes?: string | null
  verified_by?: string | null
  created_at?: string
  updated_at?: string
}

export interface AttendanceUpdate extends Partial<AttendanceInsert> {}

// ============================================================================
// LEAVE REQUEST TYPES
// ============================================================================

export interface LeaveRequest {
  id: string
  company_id: string
  employee_id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  days_requested: number
  reason: string | null
  status: LeaveStatus
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  documents: Json
  created_at: string
  updated_at: string
}

export interface LeaveRequestInsert {
  id?: string
  company_id?: string
  employee_id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  days_requested: number
  reason?: string | null
  status?: LeaveStatus
  reviewed_by?: string | null
  reviewed_at?: string | null
  review_notes?: string | null
  documents?: Json
  created_at?: string
  updated_at?: string
}

export interface LeaveRequestUpdate extends Partial<LeaveRequestInsert> {}

// ============================================================================
// PAYROLL TYPES
// ============================================================================

export interface Payroll {
  id: string
  company_id: string
  employee_id: string
  pay_period_start: string
  pay_period_end: string
  base_salary: number
  overtime_pay: number
  bonuses: number
  allowances: number
  commission: number
  gross_pay: number
  tax: number
  pension_contribution: number
  health_insurance: number
  other_deductions: number
  total_deductions: number
  net_pay: number
  currency: string
  payment_method: string
  payment_date: string | null
  payment_reference: string | null
  status: PayrollStatus
  processed_by: string | null
  processed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PayrollInsert {
  id?: string
  company_id?: string
  employee_id: string
  pay_period_start: string
  pay_period_end: string
  base_salary: number
  overtime_pay?: number
  bonuses?: number
  allowances?: number
  commission?: number
  gross_pay: number
  tax?: number
  pension_contribution?: number
  health_insurance?: number
  other_deductions?: number
  total_deductions?: number
  net_pay: number
  currency?: string
  payment_method?: string
  payment_date?: string | null
  payment_reference?: string | null
  status?: PayrollStatus
  processed_by?: string | null
  processed_at?: string | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface PayrollUpdate extends Partial<PayrollInsert> {}

// ============================================================================
// ANNOUNCEMENT TYPES
// ============================================================================

export interface Announcement {
  id: string
  company_id: string
  title: string
  content: string
  category: string | null
  priority: string
  is_pinned: boolean
  published_by: string
  target_departments: string[] | null
  target_roles: UserRole[] | null
  attachments: Json
  published_at: string
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface AnnouncementInsert {
  id?: string
  company_id?: string
  title: string
  content: string
  category?: string | null
  priority?: string
  is_pinned?: boolean
  published_by: string
  target_departments?: string[] | null
  target_roles?: UserRole[] | null
  attachments?: Json
  published_at?: string
  expires_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface AnnouncementUpdate extends Partial<AnnouncementInsert> {}

// ============================================================================
// QR CODE TYPES
// ============================================================================

export interface QRCode {
  id: string
  company_id: string
  code: string
  type: string
  valid_from: string
  valid_until: string
  is_active: boolean
  usage_count: number
  max_usage: number | null
  metadata: Json
  created_by: string | null
  created_at: string
}

export interface QRCodeInsert {
  id?: string
  company_id?: string
  code: string
  type?: string
  valid_from: string
  valid_until: string
  is_active?: boolean
  usage_count?: number
  max_usage?: number | null
  metadata?: Json
  created_by?: string | null
  created_at?: string
}

export interface QRCodeUpdate extends Partial<QRCodeInsert> {}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuditLog {
  id: string
  company_id: string | null
  user_id: string | null
  action: string
  table_name: string
  record_id: string | null
  old_values: Json | null
  new_values: Json | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface AuditLogInsert {
  id?: string
  company_id?: string | null
  user_id?: string | null
  action: string
  table_name: string
  record_id?: string | null
  old_values?: Json | null
  new_values?: Json | null
  ip_address?: string | null
  user_agent?: string | null
  created_at?: string
}

export interface AuditLogUpdate extends Partial<AuditLogInsert> {}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type TableName = keyof Database['public']['Tables']
export type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row']
export type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert']
export type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update']