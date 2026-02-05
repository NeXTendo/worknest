'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EmployeeFiltersProps {
  employmentType: string
  employmentStatus: string
  onTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export function EmployeeFilters({ employmentType, employmentStatus, onTypeChange, onStatusChange }: EmployeeFiltersProps) {
  return (
    <div className="flex gap-4">
      <Select value={employmentType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Employment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="full_time">Full Time</SelectItem>
          <SelectItem value="part_time">Part Time</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
          <SelectItem value="intern">Intern</SelectItem>
        </SelectContent>
      </Select>

      <Select value={employmentStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="on_leave">On Leave</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="terminated">Terminated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}