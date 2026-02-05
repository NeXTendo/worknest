export function PayslipEmail({ name, amount }: { name: string, amount: number }) {
  return `
    <h1>Payslip for ${name}</h1>
    <p>Your net pay: K${amount}</p>
  `
}
