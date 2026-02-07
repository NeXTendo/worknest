'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react'
import { useCompaniesStore } from '@/store/useCompaniesStore'
import { useAuthStore } from '@/store/useAuthStore'
import { CompanyCard } from '@/components/companies/company-card'
import { CompanyForm } from '@/components/companies/company-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Company } from '@/lib/database.types'

export default function CompaniesPage() {
  const { user } = useAuthStore()
  const { 
    companies, 
    isLoading, 
    fetchCompanies, 
    deleteCompany, 
    toggleCompanyStatus 
  } = useCompaniesStore()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const isSuperAdmin = user?.role === 'super_admin'

  useEffect(() => {
    if (isSuperAdmin) {
      fetchCompanies()
    }
  }, [isSuperAdmin])

  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this company? This will remove all associated data and cannot be undone.')) {
      await deleteCompany(id)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleCompanyStatus(id, currentStatus)
  }

  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center px-4">
        <div className="h-20 w-20 rounded-full bg-orange-50 flex items-center justify-center">
          <ShieldAlert className="h-10 w-10 text-orange-500" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">Access Restricted</h1>
          <p className="text-slate-500">
            This management zone is reserved for Super Administrators. Your current role does not have the necessary permissions to manage cross-company data.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Companies</h1>
            <p className="text-slate-500 font-medium">Global management of all registered organizations</p>
          </div>
        </div>
        <Button 
          onClick={() => { setSelectedCompany(undefined); setIsDialogOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 h-11 px-6 font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" /> Register New Company
        </Button>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search by company name, industry, or email..." 
            className="pl-12 h-12 bg-white border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-6 gap-2 bg-white font-semibold">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Error Section */}
      {useCompaniesStore.getState().error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-900 mb-2">Failed to Load Companies</h2>
          <p className="text-red-700 max-w-md mx-auto mb-6">
            We encountered an issue while communicating with the database. Error: <span className="font-mono text-sm">{useCompaniesStore.getState().error}</span>
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => fetchCompanies()} className="bg-red-600 hover:bg-red-700 text-white font-bold h-11 px-8 shadow-lg shadow-red-100 transition-all active:scale-95">
              Retry Connection
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="h-11 px-8 font-bold border-red-200 hover:bg-red-100 text-red-900 transition-all">
              Reload Page
            </Button>
          </div>
        </div>
      )}

      {/* Grid Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4 p-6 bg-white border rounded-2xl">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
              <Skeleton className="h-20 w-full rounded-lg" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : !useCompaniesStore.getState().error && filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : !useCompaniesStore.getState().error ? (
        <Card className="border-dashed border-2 bg-slate-50 shadow-none py-20">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm">
              <Building2 className="h-10 w-10" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-bold text-slate-900">No companies found</p>
              <p className="text-slate-500 max-w-xs mx-auto">
                {searchQuery 
                  ? `No results match your search "${searchQuery}". Try a different term.`
                  : "Start by registering your first company to the WorkNest platform."
                }
              </p>
            </div>
            {searchQuery ? (
              <Button variant="ghost" className="font-bold text-blue-600" onClick={() => setSearchQuery('')}>
                Clear search filter
              </Button>
            ) : (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100"
              >
                Register Company <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Dialog Section */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl overflow-hidden p-0 border-none shadow-2xl">
          <div className="bg-blue-600 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold flex items-center gap-3">
                <Building2 className="h-6 w-6" />
                {selectedCompany ? 'Update Company Profile' : 'Register New Organization'}
              </DialogTitle>
              <p className="text-blue-100 text-sm mt-1">
                {selectedCompany 
                  ? `Modifying details for ${selectedCompany.name}` 
                  : 'Establish a new organizational entity on the platform'
                }
              </p>
            </DialogHeader>
          </div>
          <div className="p-6">
            <CompanyForm 
              company={selectedCompany} 
              onSuccess={() => {
                setIsDialogOpen(false)
                fetchCompanies()
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
