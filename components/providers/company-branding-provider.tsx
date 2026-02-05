'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useCompany } from '@/hooks/useCompany'

interface BrandingContextType {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  companyName: string
  logoUrl: string | null
}

const BrandingContext = createContext<BrandingContextType>({
  primaryColor: '#14B8A6',
  secondaryColor: '#0F172A',
  accentColor: '#10B981',
  companyName: 'WorkNest',
  logoUrl: null,
})

export function CompanyBrandingProvider({ children }: { children: React.ReactNode }) {
  const { company } = useCompany()
  const [branding, setBranding] = useState<BrandingContextType>({
    primaryColor: '#14B8A6',
    secondaryColor: '#0F172A',
    accentColor: '#10B981',
    companyName: 'WorkNest',
    logoUrl: null,
  })

  useEffect(() => {
    if (company) {
      setBranding({
        primaryColor: company.primary_color || '#14B8A6',
        secondaryColor: company.secondary_color || '#0F172A',
        accentColor: company.accent_color || '#10B981',
        companyName: company.name || 'WorkNest',
        logoUrl: company.logo_url || null,
      })

      // Apply CSS variables
      document.documentElement.style.setProperty('--primary-color', company.primary_color || '#14B8A6')
      document.documentElement.style.setProperty('--secondary-color', company.secondary_color || '#0F172A')
      document.documentElement.style.setProperty('--accent-color', company.accent_color || '#10B981')
    }
  }, [company])

  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  )
}

export const useBranding = () => useContext(BrandingContext)
