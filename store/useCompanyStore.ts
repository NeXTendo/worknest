import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Company {
  id: string
  name: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  website?: string
  industry?: string
}

interface CompanyState {
  company: Company | null
  setCompany: (company: Company) => void
  clearCompany: () => void
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      company: null,
      setCompany: (company) => set({ company }),
      clearCompany: () => set({ company: null }),
    }),
    {
      name: 'worknest-company',
    }
  )
)
