'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDepartmentStore } from '@/store/useDepartmentStore'
import { DepartmentCard } from '@/components/departments/department-card'
import { DepartmentForm } from '@/components/departments/department-form'
import { Department } from '@/lib/database.types'
import { useToast } from '@/hooks/useToast'

export default function DepartmentsPage() {
  const { departments, isLoading, fetchDepartments, deleteDepartment } = useDepartmentStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setSelectedDepartment(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (dept: Department) => {
    setSelectedDepartment(dept)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return
    
    const { error } = await deleteDepartment(id)
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      })
    }
  }

  if (isLoading && departments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Departments</h1>
          <p className="text-slate-600 mt-1">Organize and manage your organization's structure</p>
        </div>
        <Button onClick={handleAdd} className="brand-bg hover:brand-bg shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search departments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredDepartments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((dept) => (
            <DepartmentCard 
              key={dept.id} 
              department={dept} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500">No departments found.</p>
          <Button variant="link" onClick={() => setSearchQuery('')} className="mt-2 text-worknest-teal">
            Clear search
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDepartment ? 'Edit Department' : 'Add New Department'}
            </DialogTitle>
          </DialogHeader>
          <DepartmentForm 
            departmentId={selectedDepartment?.id}
            onSuccess={() => setIsDialogOpen(false)}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
