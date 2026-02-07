import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Database, Profile, ProfileUpdate, ProfileInsert } from '@/lib/database.types'
import { insertRecord, updateRecord, deleteRecord, fetchRecords } from '@/lib/supabase/rpc-helpers'

interface UserState {
  users: Profile[]
  isLoading: boolean
  error: string | null
  fetchUsers: (companyId?: string) => Promise<void>
  addUser: (user: ProfileInsert) => Promise<{ data: string | null; error: any }>
  updateUser: (id: string, updates: ProfileUpdate) => Promise<{ data: string | null; error: any }>
  deleteUser: (id: string) => Promise<{ error: any }>
  setUserStatus: (id: string, isActive: boolean) => Promise<{ error: any }>
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async (companyId?: string) => {
    set({ isLoading: true, error: null })
    const supabase = createClient()
    
    try {
      const { data, error } = await fetchRecords(supabase, 'profiles', {
        filters: companyId ? { company_id: companyId } : undefined,
        orderBy: { column: 'created_at', ascending: false }
      })

      if (error) throw error

      set({ users: (data || []) as Profile[], isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  addUser: async (user) => {
    const supabase = createClient()
    const { data, error } = await insertRecord(supabase, 'profiles', user)
    if (!error) {
      get().fetchUsers(user.company_id || undefined)
    }
    return { data, error }
  },

  updateUser: async (id, updates) => {
    const supabase = createClient()
    const { data, error } = await updateRecord(supabase, 'profiles', id, updates)
    if (!error) {
      const companyId = get().users.find(u => u.id === id)?.company_id
      get().fetchUsers(companyId || undefined)
    }
    return { data, error }
  },

  deleteUser: async (id) => {
    const supabase = createClient()
    const companyId = get().users.find(u => u.id === id)?.company_id
    const { error } = await deleteRecord(supabase, 'profiles', id)
    if (!error) {
      get().fetchUsers(companyId || undefined)
    }
    return { error }
  },

  setUserStatus: async (id, isActive) => {
    const supabase = createClient()
    const { data, error } = await updateRecord(supabase, 'profiles', id, { is_active: isActive })
    if (!error) {
      const companyId = get().users.find(u => u.id === id)?.company_id
      get().fetchUsers(companyId || undefined)
    }
    return { error }
  }
}))
