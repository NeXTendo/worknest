export function LeaveApprovedEmail({ name, dates }: { name: string, dates: string }) {
  return `
    <h1>Leave Approved</h1>
    <p>Hello ${name}, your leave request for ${dates} has been approved.</p>
  `
}
