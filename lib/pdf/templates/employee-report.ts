export function generateEmployeeReportPDF(employees: any[]) {
  return {
    content: `Employee Report - Total: ${employees.length}`,
    filename: 'employee-report.pdf',
  }
}
