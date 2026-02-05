'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, File } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
}

export function FileUpload({ onFileSelect, accept, maxSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSize) {
      setError(`File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`)
      return
    }

    setError('')
    setSelectedFile(file)
    onFileSelect(file)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" asChild>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
        </Button>
        {selectedFile && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded">
            <File className="h-4 w-4" />
            <span className="text-sm">{selectedFile.name}</span>
            <button
              onClick={() => {
                setSelectedFile(null)
                setError('')
              }}
              className="text-gray-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}