export function generatePayslipPDF(payroll: any) {
  return {
    content: `Payslip for ${payroll.employee_name}`,
    filename: `payslip-${payroll.id}.pdf`,
  }
}
