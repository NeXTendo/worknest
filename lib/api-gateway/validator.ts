// lib/api-gateway/validator.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'

interface ValidationResult {
  success: boolean
  error?: string
  data?: any
}

// Define validation schemas for different endpoints
const schemas = {
  '/api/auth/login': z.object({
    identifier: z.string().min(3, 'Identifier must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
  
  '/api/employees': z.object({
    employee_number: z.string().min(1, 'Employee number is required'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    employment_type: z.enum(['full_time', 'part_time', 'contract', 'intern', 'temporary']),
    employment_status: z.enum(['active', 'on_leave', 'suspended', 'terminated', 'pending']).default('active'),
    hire_date: z.string().min(1, 'Hire date is required'),
  }),
  
  '/api/attendance': z.object({
    employee_id: z.string().uuid('Invalid employee ID'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time_in: z.string().optional(),
    time_out: z.string().optional(),
    status: z.enum(['present', 'absent', 'late', 'half_day', 'on_leave']).default('present'),
  }),
  
  '/api/leave': z.object({
    employee_id: z.string().uuid('Invalid employee ID'),
    leave_type: z.enum(['annual', 'sick', 'maternity', 'paternity', 'unpaid', 'compassionate']),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date'),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid end date'),
    days_requested: z.number().min(0.5, 'Must request at least 0.5 days'),
    reason: z.string().min(10, 'Reason must be at least 10 characters'),
  }),
  
  '/api/payroll': z.object({
    employee_id: z.string().uuid('Invalid employee ID'),
    pay_period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date'),
    pay_period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid end date'),
    base_salary: z.number().min(0, 'Base salary must be positive'),
    gross_pay: z.number().min(0, 'Gross pay must be positive'),
    net_pay: z.number().min(0, 'Net pay must be positive'),
  }),
}

/**
 * Validate request body against schema
 */
export async function validateRequest(
  request: NextRequest,
  pathname: string
): Promise<ValidationResult> {
  try {
    // Get base path (remove dynamic segments)
    const basePath = pathname.replace(/\/\[.*?\]/g, '').replace(/\/[a-f0-9-]{36}$/i, '')
    
    // Check if we have a schema for this endpoint
    const schema = schemas[basePath as keyof typeof schemas]
    
    if (!schema) {
      // No validation schema defined - allow request
      return { success: true }
    }
    
    // Parse request body
    let body: any
    try {
      body = await request.json()
    } catch {
      return {
        success: false,
        error: 'Invalid JSON in request body',
      }
    }
    
    // Validate against schema
    const result = schema.safeParse(body)
    
    if (!result.success) {
      const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return {
        success: false,
        error: errors.join(', '),
      }
    }
    
    return {
      success: true,
      data: result.data,
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Validation error',
    }
  }
}

/**
 * Sanitize input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }
  
  return input
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false
  
  const d = new Date(date)
  return d instanceof Date && !isNaN(d.getTime())
}
