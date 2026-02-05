import { z } from 'zod'

export const payrollSchema = z.object({
  employee_id: z.string().uuid(),
  pay_period: z.string().min(1, 'Pay period is required'),
  basic_salary: z.number().min(0, 'Basic salary must be positive'),
  bonuses: z.number().min(0).default(0),
  deductions: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  net_pay: z.number().min(0),
  status: z.enum(['draft', 'processing', 'processed', 'paid', 'failed']).default('draft'),
})

export type PayrollInput = z.infer<typeof payrollSchema>