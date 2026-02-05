export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-worknest-navy via-slate-900 to-worknest-navy">
      {children}
    </div>
  )
}