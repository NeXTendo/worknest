'use client'

export function Payslip({ payroll }: { payroll: any }) {
  return (
    <div className="bg-white p-8 rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">Payslip</h2>
      <div className="space-y-2">
        <p>Employee: {payroll.employees?.first_name}</p>
        <p>Period: {payroll.pay_period}</p>
        <p>Net Pay: K{payroll.net_pay}</p>
      </div>
    </div>
  )
}
