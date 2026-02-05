import { create } from 'zustand'

interface FilterState {
  // Employee filters
  employeeFilters: {
    search: string
    department: string[]
    status: string[]
    employmentType: string[]
  }
  
  // Attendance filters
  attendanceFilters: {
    search: string
    dateRange: { from: Date | null; to: Date | null }
    status: string[]
    department: string[]
  }
  
  // Payroll filters
  payrollFilters: {
    search: string
    period: { start: Date | null; end: Date | null }
    status: string[]
    department: string[]
  }
  
  // Leave filters
  leaveFilters: {
    search: string
    dateRange: { from: Date | null; to: Date | null }
    status: string[]
    type: string[]
  }
  
  // Actions
  setEmployeeFilters: (filters: Partial<FilterState['employeeFilters']>) => void
  setAttendanceFilters: (filters: Partial<FilterState['attendanceFilters']>) => void
  setPayrollFilters: (filters: Partial<FilterState['payrollFilters']>) => void
  setLeaveFilters: (filters: Partial<FilterState['leaveFilters']>) => void
  resetEmployeeFilters: () => void
  resetAttendanceFilters: () => void
  resetPayrollFilters: () => void
  resetLeaveFilters: () => void
}

const defaultEmployeeFilters = {
  search: '',
  department: [],
  status: [],
  employmentType: [],
}

const defaultAttendanceFilters = {
  search: '',
  dateRange: { from: null, to: null },
  status: [],
  department: [],
}

const defaultPayrollFilters = {
  search: '',
  period: { start: null, end: null },
  status: [],
  department: [],
}

const defaultLeaveFilters = {
  search: '',
  dateRange: { from: null, to: null },
  status: [],
  type: [],
}

export const useFilterStore = create<FilterState>((set) => ({
  employeeFilters: defaultEmployeeFilters,
  attendanceFilters: defaultAttendanceFilters,
  payrollFilters: defaultPayrollFilters,
  leaveFilters: defaultLeaveFilters,
  
  setEmployeeFilters: (filters) =>
    set((state) => ({
      employeeFilters: { ...state.employeeFilters, ...filters },
    })),
    
  setAttendanceFilters: (filters) =>
    set((state) => ({
      attendanceFilters: { ...state.attendanceFilters, ...filters },
    })),
    
  setPayrollFilters: (filters) =>
    set((state) => ({
      payrollFilters: { ...state.payrollFilters, ...filters },
    })),
    
  setLeaveFilters: (filters) =>
    set((state) => ({
      leaveFilters: { ...state.leaveFilters, ...filters },
    })),
    
  resetEmployeeFilters: () =>
    set({ employeeFilters: defaultEmployeeFilters }),
    
  resetAttendanceFilters: () =>
    set({ attendanceFilters: defaultAttendanceFilters }),
    
  resetPayrollFilters: () =>
    set({ payrollFilters: defaultPayrollFilters }),
    
  resetLeaveFilters: () =>
    set({ leaveFilters: defaultLeaveFilters }),
}))
