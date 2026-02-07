import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Department, DepartmentInsert, DepartmentUpdate } from '@/lib/database.types'
import { fetchRecords, insertRecord, updateRecord, deleteRecord } from '@/lib/supabase/rpc-helpers'

interface DepartmentState {
  departments: Department[]
  isLoading: boolean
  error: string | null
  fetchDepartments: () => Promise<void>
  addDepartment: (department: DepartmentInsert) => Promise<{ data: string | null; error: any }>
  updateDepartment: (id: string, updates: DepartmentUpdate) => Promise<{ data: string | null; error: any }>
  deleteDepartment: (id: string) => Promise<{ error: any }>
}

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  isLoading: false,
  error: null,

  fetchDepartments: async () => {
    set({ isLoading: true, error: null })
    const supabase = createClient()
    try {
      const { data, error } = await fetchRecords(supabase, 'departments', {
        orderBy: { column: 'name', ascending: true }
      })
      if (error) throw error
      set({ departments: data || [], isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  addDepartment: async (department) => {
    const supabase = createClient()
    const { data, error } = await insertRecord(supabase, 'departments', department)
    if (!error) {
      get().fetchDepartments()
    }
    return { data, error }
  },

  updateDepartment: async (id, updates) => {
    const supabase = createClient()
    const { data, error } = await updateRecord(supabase, 'departments', id, updates)
    if (!error) {
      get().fetchDepartments()
    }
    return { data, error }
  },

  deleteDepartment: async (id) => {
    const supabase = createClient()
    const { error } = await deleteRecord(supabase, 'departments', id)
    if (!error) {
      get().fetchDepartments()
    }
    return { error }
  },
}))
