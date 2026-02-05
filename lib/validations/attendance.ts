import { z } from 'zod'

export const attendanceSchema = z.object({
  employee_id: z.string().uuid('Invalid employee ID'),
  date: z.string().min(1, 'Date is required'),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  status: z.enum(['present', 'absent', 'late', 'half_day', 'on_leave']),
  notes: z.string().optional(),
})

export type AttendanceInput = z.infer<typeof attendanceSchema>