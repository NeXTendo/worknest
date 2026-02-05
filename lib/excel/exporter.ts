export async function exportToExcel(data: any[], filename: string) {
  // Simplified export - in production use a library like xlsx
  const csv = convertToCSV(data)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(obj => Object.values(obj).join(','))
  return [headers, ...rows].join('\n')
}
