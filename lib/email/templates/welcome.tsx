export function WelcomeEmail({ name }: { name: string }) {
  return `
    <h1>Welcome to WorkNest, ${name}!</h1>
    <p>Your account has been created successfully.</p>
  `
}
