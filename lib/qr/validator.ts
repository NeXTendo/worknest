export function validateQRCode(code: string): boolean {
  if (!code || code.length < 10) return false
  // Add your QR code validation logic
  return true
}

export function extractEmployeeId(code: string): string | null {
  try {
    const data = JSON.parse(code)
    return data.employee_id || null
  } catch {
    return null
  }
}
