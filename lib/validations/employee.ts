import { z } from 'zod'

export const employeeSchema = z.object({
  employee_number: z.string().min(1, 'Employee number is required'),
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  national_id: z.string().optional(),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'intern', 'temporary']),
  employment_status: z.enum(['active', 'on_leave', 'suspended', 'terminated', 'pending']),
  hire_date: z.string().min(1, 'Hire date is required'),
  department_id: z.string().uuid().optional(),
  job_title_id: z.string().uuid().optional(),
  base_salary: z.number().min(0).optional(),
})

export type EmployeeInput = z.infer<typeof employeeSchema>