import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, BarChart3, Clock, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-worknest-navy via-slate-900 to-worknest-navy text-white">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="mb-8 inline-block">
            <div className="h-20 w-20 mx-auto rounded-2xl bg-worknest-teal flex items-center justify-center mb-6">
              <span className="text-white font-bold text-3xl">WN</span>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-worknest-teal to-worknest-emerald bg-clip-text text-transparent">
            Home to every workforce
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Complete HR management solution for modern businesses. Manage employees, attendance, payroll, and more with WorkNest.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-worknest-teal hover:bg-worknest-teal/90 text-white">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Employee Management"
            description="Complete employee profiles and organizational structure"
          />
          <FeatureCard
            icon={<Clock className="h-8 w-8" />}
            title="Smart Attendance"
            description="QR-based check-in with automatic time tracking"
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Analytics"
            description="Real-time insights and performance metrics"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Secure"
            description="Bank-level security with multi-tenant isolation"
          />
        </div>

        {/* Footer */}
        <div className="text-center pt-20 border-t border-white/10">
          <p className="text-gray-400 mb-2">
            Powered by <span className="text-worknest-teal font-semibold">TechOhns</span>
          </p>
          <p className="text-sm text-gray-500">
            © 2024 TechOhns. All rights reserved. | Lusaka, Zambia
          </p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-worknest-teal/50 transition-all">
      <div className="h-12 w-12 rounded-lg bg-worknest-teal/20 flex items-center justify-center text-worknest-teal mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}