export function PasswordResetEmail({ link }: { link: string }) {
  return `
    <h1>Password Reset</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${link}">Reset Password</a>
  `
}
