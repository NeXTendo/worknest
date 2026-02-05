'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PayrollForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label>Pay Period</Label>
        <Input type="month" />
      </div>
      <div>
        <Label>Base Salary</Label>
        <Input type="number" />
      </div>
      <Button type="submit">Process</Button>
    </form>
  )
}
