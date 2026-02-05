'use client'

import { RoleGate } from './role-gate'

interface PermissionGateProps {
  children: React.ReactNode
  permission: 'view' | 'create' | 'edit' | 'delete'
  resource: string
  fallback?: React.ReactNode
}

export function PermissionGate({ children, permission, resource, fallback }: PermissionGateProps) {
  // Simplified permission logic - can be expanded based on needs
  const rolesByPermission: Record<string, string[]> = {
    view: ['super_admin', 'main_admin', 'hr_admin', 'manager', 'employee'],
    create: ['super_admin', 'main_admin', 'hr_admin'],
    edit: ['super_admin', 'main_admin', 'hr_admin'],
    delete: ['super_admin', 'main_admin'],
  }

  return (
    <RoleGate allowedRoles={rolesByPermission[permission] || []} fallback={fallback}>
      {children}
    </RoleGate>
  )
}
