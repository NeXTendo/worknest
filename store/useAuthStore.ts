import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'super_admin' | 'main_admin' | 'hr_admin' | 'manager' | 'employee'

interface User {
  id: string
  email: string
  role: UserRole
  company_id: string
  employee_id?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  hasPermission: (requiredRoles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      hasPermission: (requiredRoles) => {
        const { user } = get()
        if (!user) return false
        if (user.role === 'super_admin') return true // Super admin has all permissions
        return requiredRoles.includes(user.role)
      },
    }),
    {
      name: 'worknest-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
