export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Insert: {
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
        Update: {
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
        Update: {
          id?: string
          company_id?: string | null
          role?: 'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'
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
      }
      departments: {
        Row: {
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
        Insert: {
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
        Update: {
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
      }
      job_titles: {
        Row: {
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
        Insert: {
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
        Update: {
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
          alternate_phone: string | null
          date_of_birth: string | null
          gender: string | null
          nationality: string | null
          national_id: string | null
          passport_number: string | null
          avatar_url: string | null
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          state_province: string | null
          postal_code: string | null
          country: string | null
          emergency_contact_name: string | null
          emergency_contact_relationship: string | null
          emergency_contact_phone: string | null
          emergency_contact_address: string | null
          employment_type: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
          employment_status: 'active' | 'on_leave' | 'suspended' | 'terminated' | 'pending'
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
          currency: string | null
          pay_frequency: string | null
          tax_number: string | null
          notes: string | null
          skills: string[] | null
          certifications: Json
          documents: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
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
          nationality?: string | null
          national_id?: string | null
          passport_number?: string | null
          avatar_url?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          state_province?: string | null
          postal_code?: string | null
          country?: string | null
          emergency_contact_name?: string | null
          emergency_contact_relationship?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_address?: string | null
          employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
          employment_status?: 'active' | 'on_leave' | 'suspended' | 'terminated' | 'pending'
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
          currency?: string | null
          pay_frequency?: string | null
          tax_number?: string | null
          notes?: string | null
          skills?: string[] | null
          certifications?: Json
          documents?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string | null
          employee_number?: string
          department_id?: string | null
          job_title_id?: string | null
          manager_id?: string | null
          first_name?: string
          middle_name?: string | null
          last_name?: string
          email?: string
          phone?: string | null
          alternate_phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          nationality?: string | null
          national_id?: string | null
          passport_number?: string | null
          avatar_url?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          state_province?: string | null
          postal_code?: string | null
          country?: string | null
          emergency_contact_name?: string | null
          emergency_contact_relationship?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_address?: string | null
          employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
          employment_status?: 'active' | 'on_leave' | 'suspended' | 'terminated' | 'pending'
          hire_date?: string
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
          currency?: string | null
          pay_frequency?: string | null
          tax_number?: string | null
          notes?: string | null
          skills?: string[] | null
          certifications?: Json
          documents?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
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
        Insert: {
          id?: string
          company_id?: string
          employee_id: string
          date: string
          time_in?: string | null
          time_out?: string | null
          status?: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
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
        Update: {
          id?: string
          company_id?: string
          employee_id?: string
          date?: string
          time_in?: string | null
          time_out?: string | null
          status?: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
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
        Insert: {
          id?: string
          company_id?: string
          employee_id: string
          leave_type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'compassionate'
          start_date: string
          end_date: string
          days_requested: number
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          reviewed_by?: string | null
          reviewed_at?: string | null
          review_notes?: string | null
          documents?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          employee_id?: string
          leave_type?: 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'compassionate'
          start_date?: string
          end_date?: string
          days_requested?: number
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          reviewed_by?: string | null
          reviewed_at?: string | null
          review_notes?: string | null
          documents?: Json
          created_at?: string
          updated_at?: string
        }
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
        Insert: {
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
          status?: 'draft' | 'processing' | 'processed' | 'paid' | 'failed'
          processed_by?: string | null
          processed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          employee_id?: string
          pay_period_start?: string
          pay_period_end?: string
          base_salary?: number
          overtime_pay?: number
          bonuses?: number
          allowances?: number
          commission?: number
          gross_pay?: number
          tax?: number
          pension_contribution?: number
          health_insurance?: number
          other_deductions?: number
          total_deductions?: number
          net_pay?: number
          currency?: string
          payment_method?: string
          payment_date?: string | null
          payment_reference?: string | null
          status?: 'draft' | 'processing' | 'processed' | 'paid' | 'failed'
          processed_by?: string | null
          processed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          company_id: string
          title: string
          content: string
          category: string | null
          priority: string
          is_pinned: boolean
          published_by: string
          target_departments: string[] | null
          target_roles: Array<'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'> | null
          attachments: Json
          published_at: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string
          title: string
          content: string
          category?: string | null
          priority?: string
          is_pinned?: boolean
          published_by: string
          target_departments?: string[] | null
          target_roles?: Array<'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'> | null
          attachments?: Json
          published_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          content?: string
          category?: string | null
          priority?: string
          is_pinned?: boolean
          published_by?: string
          target_departments?: string[] | null
          target_roles?: Array<'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'> | null
          attachments?: Json
          published_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
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
        Insert: {
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
        Update: {
          id?: string
          company_id?: string
          code?: string
          type?: string
          valid_from?: string
          valid_until?: string
          is_active?: boolean
          usage_count?: number
          max_usage?: number | null
          metadata?: Json
          created_by?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
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
        Insert: {
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
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      employment_type: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary'
      employment_status: 'active' | 'on_leave' | 'suspended' | 'terminated' | 'pending'
      user_role: 'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'
      leave_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
      leave_type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'compassionate'
      payroll_status: 'draft' | 'processing' | 'processed' | 'paid' | 'failed'
      attendance_status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helper exports
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]