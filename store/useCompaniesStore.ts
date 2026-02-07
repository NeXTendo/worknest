import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { fetchRecords, insertRecord, updateRecord, deleteRecord } from '@/lib/supabase/rpc-helpers'
import { Company } from '@/lib/database.types'

interface CompaniesState {
  companies: Company[]
  isLoading: boolean
  error: string | null
  fetchCompanies: () => Promise<void>
  addCompany: (company: Partial<Company>) => Promise<boolean>
  updateCompany: (id: string, updates: Partial<Company>) => Promise<boolean>
  deleteCompany: (id: string) => Promise<boolean>
  toggleCompanyStatus: (id: string, currentStatus: boolean) => Promise<boolean>
}

export const useCompaniesStore = create<CompaniesState>((set, get) => ({
  companies: [],
  isLoading: false,
  error: null,

  fetchCompanies: async () => {
    set({ isLoading: true, error: null })
    const supabase = createClient()
    try {
      console.log('[Store] Fetching companies...')
      const { data, error } = await fetchRecords(supabase, 'companies', {
        orderBy: { column: 'created_at', ascending: false }
      })
      if (error) {
        console.error('[Store] Fetch error:', error)
        throw error
      }
      console.log(`[Store] Successfully fetched ${data?.length || 0} companies`)
      set({ companies: (data || []) as Company[], isLoading: false })
    } catch (err: any) {
      console.error('[Store] fetchCompanies failed:', err)
      set({ error: err.message, isLoading: false })
    }
  },

  addCompany: async (company) => {
    set({ isLoading: true, error: null })
    const supabase = createClient()
    try {
      console.log('[Store] Adding company:', company.name)
      const { error, data } = await insertRecord(supabase, 'companies', company as any)
      if (error) {
        console.error('[Store] Insert error:', error)
        throw error
      }
      console.log('[Store] Company added successfully', data)
      await get().fetchCompanies()
      return true
    } catch (err: any) {
      console.error('[Store] addCompany failed:', err)
      set({ error: err.message, isLoading: false })
      return false
    }
  },

  updateCompany: async (id, updates) => {
    set({ isLoading: true, error: null })
    const supabase = createClient()
    try {
      console.log('[Store] Updating company:', id, updates)
      const { error } = await updateRecord(supabase, 'companies', id, updates)
      if (error) {
        console.error('[Store] updateCompany error:', error)
        throw error
      }
      await get().fetchCompanies()
      return true
    } catch (err: any) {
      console.error('[Store] updateCompany failed:', err)
      set({ error: err.message, isLoading: false })
      return false
    }
  },

  deleteCompany: async (id) => {
    set({ isLoading: true, error: null })
    const supabase = createClient()
    try {
      console.log('[Store] Deleting company:', id)
      const { error } = await deleteRecord(supabase, 'companies', id)
      if (error) {
        console.error('[Store] deleteCompany error:', error)
        throw error
      }
      await get().fetchCompanies()
      return true
    } catch (err: any) {
      console.error('[Store] deleteCompany failed:', err)
      set({ error: err.message, isLoading: false })
      return false
    }
  },

  toggleCompanyStatus: async (id, currentStatus) => {
    return get().updateCompany(id, { is_active: !currentStatus })
  }
}))
