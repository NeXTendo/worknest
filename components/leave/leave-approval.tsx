'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/useToast'
import { updateRecord } from '@/lib/supabase/rpc-helpers'

interface LeaveApprovalProps {
  leaveId: string
  onComplete: () => void
}

export function LeaveApproval({ leaveId, onComplete }: LeaveApprovalProps) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleAction = async (action: 'approved' | 'rejected') => {
    setLoading(true)
    try {
      const { error } = await updateRecord(
        supabase,
        'leave_requests',
        leaveId,
        {
          status: action,
          review_notes: action === 'rejected' ? notes : null,
          reviewed_at: new Date().toISOString(),
        }
      )

      if (error) throw error

      toast({
        title: 'Success',
        description: `Leave request ${action}`,
      })

      onComplete()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Add notes (required for rejection)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
      />
      <div className="flex gap-2">
        <Button
          onClick={() => handleAction('approved')}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          Approve
        </Button>
        <Button
          onClick={() => handleAction('rejected')}
          disabled={loading || !notes}
          variant="destructive"
        >
          Reject
        </Button>
      </div>
    </div>
  )
}
