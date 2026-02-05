// Auto-generated supabase types for WorkNest minimal schema
// Adjust fields as your DB evolves. Keeps types lightweight and useful

import { EmploymentStatus, EmploymentType, UserRole } from './index'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          primary_color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          primary_color?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          logo_url?: string | null
          primary_color?: string | null
          created_at?: string
        }
      }

      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          employee_count: number
          budget: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          employee_count?: number
          budget?: number | null
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          employee_count?: number
          budget?: number | null
          created_at?: string
        }
      }

      job_titles: {
        Row: {
          id: string
          title: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          created_at?: string
        }
      }

      employees: {
        Row: {
          id: string
          employee_number: string
          first_name: string
          last_name: string
          email: string
          avatar_url: string | null
          department_id: string | null
          job_title_id: string | null
          employment_status: EmploymentStatus
          employment_type: EmploymentType
          hire_date: string | null
          base_salary: number | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_number: string
          first_name: string
          last_name: string
          email: string
          avatar_url?: string | null
          department_id?: string | null
          job_title_id?: string | null
          employment_status?: EmploymentStatus
          employment_type?: EmploymentType
          hire_date?: string | null
          base_salary?: number | null
          created_at?: string
        }
        Update: {
          employee_number?: string
          first_name?: string
          last_name?: string
          email?: string
          avatar_url?: string | null
          department_id?: string | null
          job_title_id?: string | null
          employment_status?: EmploymentStatus
          employment_type?: EmploymentType
          hire_date?: string | null
          base_salary?: number | null
          created_at?: string
        }
      }

      attendance: {
        Row: {
          id: string
          employee_id: string
          date: string
          time_in: string | null
          time_out: string | null
          status: string
          hours_worked: number | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          date: string
          time_in?: string | null
          time_out?: string | null
          status?: string
          hours_worked?: number | null
          created_at?: string
        }
        Update: {
          employee_id?: string
          date?: string
          time_in?: string | null
          time_out?: string | null
          status?: string
          hours_worked?: number | null
          created_at?: string
        }
      }

      leave_requests: {
        Row: {
          id: string
          employee_id: string
          type: string
          status: string
          from_date: string
          to_date: string
          days: number
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          type: string
          status?: string
          from_date: string
          to_date: string
          days: number
          reason?: string | null
          created_at?: string
        }
        Update: {
          type?: string
          status?: string
          from_date?: string
          to_date?: string
          days?: number
          reason?: string | null
          created_at?: string
        }
      }

      payroll: {
        Row: {
          id: string
          employee_id: string
          period_start: string
          period_end: string
          gross_pay: number
          net_pay: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          period_start: string
          period_end: string
          gross_pay: number
          net_pay: number
          status?: string
          created_at?: string
        }
        Update: {
          period_start?: string
          period_end?: string
          gross_pay?: number
          net_pay?: number
          status?: string
          created_at?: string
        }
      }

      announcements: {
        Row: {
          id: string
          title: string
          body: string
          priority: string | null
          target_roles: UserRole[] | null
          pinned: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          body: string
          priority?: string | null
          target_roles?: UserRole[] | null
          pinned?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          body?: string
          priority?: string | null
          target_roles?: UserRole[] | null
          pinned?: boolean
          expires_at?: string | null
          created_at?: string
        }
      }

      qr_codes: {
        Row: {
          id: string
          code: string
          employee_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          employee_id?: string | null
          created_at?: string
        }
        Update: {
          code?: string
          employee_id?: string | null
          created_at?: string
        }
      }

      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          details?: Json | null
          created_at?: string
        }
        Update: {
          user_id?: string | null
          action?: string
          details?: Json | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
  }
}
 
export type SupabaseJson = Json
