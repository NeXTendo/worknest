import { z } from 'zod'

export const leaveSchema = z.object({
  employee_id: z.string().uuid(),
  leave_type: z.enum(['annual', 'sick', 'maternity', 'paternity', 'unpaid', 'compassionate']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  days_requested: z.number().min(0.5, 'Must request at least 0.5 days'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
})

export type LeaveInput = z.infer<typeof leaveSchema>