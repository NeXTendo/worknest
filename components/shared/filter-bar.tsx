'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FilterBarProps {
  activeFilters: Record<string, string>
  onClearFilter: (key: string) => void
  onClearAll: () => void
}

export function FilterBar({ activeFilters, onClearFilter, onClearAll }: FilterBarProps) {
  const filterCount = Object.keys(activeFilters).filter(k => activeFilters[k] && activeFilters[k] !== 'all').length

  if (filterCount === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap p-4 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600">Active filters:</span>
      {Object.entries(activeFilters).map(([key, value]) => {
        if (!value || value === 'all') return null
        return (
          <div key={key} className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border">
            <span className="capitalize">{key.replace('_', ' ')}:</span>
            <span className="font-medium">{value.replace('_', ' ')}</span>
            <button onClick={() => onClearFilter(key)} className="ml-1 hover:text-red-600">
              <X className="h-3 w-3" />
            </button>
          </div>
        )
      })}
      <Button variant="ghost" size="sm" onClick={onClearAll}>
        Clear all
      </Button>
    </div>
  )
}