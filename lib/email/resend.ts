// Resend configuration
export const resend = {
  apiKey: process.env.RESEND_API_KEY,
  from: 'WorkNest <noreply@worknest.com>',
}

export async function sendEmail(to: string, subject: string, html: string) {
  // Implement Resend email sending
  console.log('Sending email to:', to)
  console.log('Subject:', subject)
  return { success: true }
}
