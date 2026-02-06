export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['companies']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          company_id: string | null
          role: 'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'
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
        Insert: {
          id: string
          company_id?: string | null
          role?: 'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'
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
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      employees: {
        Row: {
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
          date_of_birth: string | null
          gender: string | null
          employment_type: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
          employment_status: 'active' | 'on_leave' | 'suspended' | 'terminated' | 'pending'
          hire_date: string
          base_salary: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['employees']['Row'], 'id' | 'created_at' | 'updated_at' | 'company_id'> & {
          id?: string
          company_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['employees']['Insert']>
      }
      attendance: {
        Row: {
          id: string
          company_id: string
          employee_id: string
          date: string
          time_in: string | null
          time_out: string | null
          status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
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
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at' | 'updated_at' | 'company_id'> & {
          id?: string
          company_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
      qr_codes: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['qr_codes']['Row'], 'id' | 'created_at' | 'company_id' | 'usage_count'> & {
          id?: string
          company_id?: string
          usage_count?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['qr_codes']['Insert']>
      }
      leave_requests: {
        Row: {
          id: string
          company_id: string
          employee_id: string
          leave_type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'compassionate'
          start_date: string
          end_date: string
          days_requested: number
          reason: string | null
          status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          reviewed_by: string | null
          reviewed_at: string | null
          review_notes: string | null
          documents: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leave_requests']['Row'], 'id' | 'created_at' | 'updated_at' | 'company_id'> & {
          id?: string
          company_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['leave_requests']['Insert']>
      }
      payroll: {
        Row: {
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
          status: 'draft' | 'processing' | 'processed' | 'paid' | 'failed'
          processed_by: string | null
          processed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['payroll']['Row'], 'id' | 'created_at' | 'updated_at' | 'company_id'> & {
          id?: string
          company_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['payroll']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}