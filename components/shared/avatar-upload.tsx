'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, X } from 'lucide-react'
import Image from 'next/image'

interface AvatarUploadProps {
  currentUrl?: string
  onUpload: (file: File) => void
  onRemove?: () => void
}

export function AvatarUpload({ currentUrl, onUpload, onRemove }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      onUpload(file)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200">
        {preview ? (
          <Image src={preview} alt="Avatar" fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Camera className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" asChild>
          <label className="cursor-pointer">
            <Camera className="h-4 w-4 mr-2" />
            Upload
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </Button>
        {preview && onRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setPreview(null)
              onRemove()
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}