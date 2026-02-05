'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/useToast'

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
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: action,
          rejection_reason: action === 'rejected' ? notes : null,
          approved_at: action === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', leaveId)

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
      <Textarea
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
