'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PayrollDetailPage({ params }: { params: { id: string } }) {
  const [payroll, setPayroll] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchPayroll()
  }, [params.id])

  async function fetchPayroll() {
    try {
      const { data, error } = await supabase
        .from('payroll')
        .select('*, employees(*)')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setPayroll(data)
    } catch (error) {
      console.error('Error fetching payroll:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!payroll) {
    return <div>Payroll record not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Payroll Details</h1>
          <p className="text-gray-500">Pay Period: {payroll.pay_period}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Basic Salary:</dt>
              <dd>K {payroll.basic_salary?.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Bonuses:</dt>
              <dd>K {payroll.bonuses?.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between text-red-600">
              <dt className="font-medium">Deductions:</dt>
              <dd>-K {payroll.deductions?.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between text-red-600">
              <dt className="font-medium">Tax:</dt>
              <dd>-K {payroll.tax?.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-lg">
              <dt>Net Pay:</dt>
              <dd>K {payroll.net_pay?.toLocaleString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}