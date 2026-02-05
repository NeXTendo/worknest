import { UserRole } from '@/types'

export function hasPermission(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (userRole === 'super_admin') return true
  return allowedRoles.includes(userRole)
}

export const PERMISSIONS = {
  VIEW_DASHBOARD: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
  MANAGE_EMPLOYEES: ['super_admin', 'main_admin', 'hr_admin'],
  VIEW_EMPLOYEES: ['super_admin', 'main_admin', 'hr_admin', 'manager'],
  MANAGE_DEPARTMENTS: ['super_admin', 'main_admin', 'hr_admin'],
  VIEW_ATTENDANCE: ['super_admin', 'main_admin', 'hr_admin', 'manager'],
  MANAGE_PAYROLL: ['super_admin', 'main_admin', 'hr_admin'],
  APPROVE_LEAVE: ['super_admin', 'main_admin', 'hr_admin'],
  REQUEST_LEAVE: ['employee'],
  MANAGE_USERS: ['super_admin', 'main_admin'],
  MANAGE_SETTINGS: ['super_admin', 'main_admin'],
  GENERATE_QR: ['super_admin', 'main_admin'],
  POST_ANNOUNCEMENTS: ['super_admin', 'main_admin', 'hr_admin'],
  VIEW_AUDIT_LOGS: ['super_admin'],
} as const
