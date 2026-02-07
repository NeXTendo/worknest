'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Users, BarChart3, Clock, Shield, 
  CheckCircle2, Star, TrendingUp, Award,
  Lock, Zap, Globe, Smartphone
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image 
                src="/worknest-logo.png" 
                alt="WorkNest Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">WorkNest</span>
          </div>
          <Link href="/auth/login">
            <Button variant="ghost" className="font-medium text-slate-300 hover:text-white hover:bg-slate-800">
              Log in
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto mb-20 relative">
            {/* Multiple Animated Background Blobs */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-worknest-teal/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-worknest-teal/10 text-worknest-teal px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Award className="h-4 w-4" />
              <span className="text-sm font-semibold">Trusted by 50+ Companies in Zambia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              <span className="inline-block animate-text-shimmer bg-[linear-gradient(110deg,#0F172A,45%,#14B8A6,55%,#0F172A)] bg-[length:250%_100%] bg-clip-text text-transparent">
                Home to every workforce
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              The complete HR management solution for modern businesses. Simplify attendance, payroll, and employee management with precision.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-worknest-teal hover:bg-teal-600 text-white min-w-[200px] h-12 rounded-lg font-semibold text-lg shadow-lg shadow-worknest-teal/30 hover:shadow-xl hover:shadow-worknest-teal/40 transition-all hover:-translate-y-0.5">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[200px] h-12 rounded-lg font-semibold text-lg border-2 hover:bg-slate-50">
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-worknest-teal" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-worknest-teal" />
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-worknest-teal" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-20 max-w-5xl mx-auto">
            <StatCard number="50+" label="Companies" />
            <StatCard number="2,000+" label="Employees Managed" />
            <StatCard number="99.5%" label="Uptime" />
            <StatCard number="4.8/5" label="Customer Rating" icon={<Star className="h-5 w-5 text-amber-500 fill-amber-500" />} />
          </div>

          {/* Social Proof - Testimonials */}
          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-slate-900">
              Loved by teams worldwide
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              See what our customers have to say about WorkNest
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <TestimonialCard
                quote="WorkNest transformed how we manage our remote team. Attendance tracking is now effortless!"
                author="Sarah Johnson"
                role="HR Director"
                company="TechCorp Inc."
                rating={5}
              />
              <TestimonialCard
                quote="The payroll automation saved us 20 hours per month. Best investment we've made."
                author="Michael Chen"
                role="Operations Manager"
                company="StartupHub"
                rating={5}
              />
              <TestimonialCard
                quote="Intuitive, powerful, and reliable. Our team adopted it in just one day."
                author="Emily Rodriguez"
                role="CEO"
                company="GrowthLabs"
                rating={5}
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-worknest-teal/10 text-worknest-teal hover:bg-worknest-teal/20">
                Features
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
                Everything you need to manage your workforce
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Powerful features designed to streamline your HR operations
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Employee Hub"
                description="Centralize profiles, roles, and organizational structures in one place."
              />
              <FeatureCard
                icon={<Clock className="h-6 w-6" />}
                title="Smart Attendance"
                description="GPS & QR verification with automated tracking and real-time updates."
              />
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Real-time Analytics"
                description="Performance metrics and workforce insights at your fingertips."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Enterprise Security"
                description="Bank-grade encryption and granular access controls."
              />
              <FeatureCard
                icon={<TrendingUp className="h-6 w-6" />}
                title="Payroll Automation"
                description="Automated salary calculations with tax compliance built-in."
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Leave Management"
                description="Streamlined leave requests and approval workflows."
              />
              <FeatureCard
                icon={<Globe className="h-6 w-6" />}
                title="Multi-location"
                description="Manage teams across multiple offices and time zones."
              />
              <FeatureCard
                icon={<Smartphone className="h-6 w-6" />}
                title="Mobile Ready"
                description="Full-featured mobile apps for iOS and Android."
              />
            </div>
          </div>

          {/* Trust & Security Section */}
          <div className="mb-20 bg-slate-900 text-white rounded-2xl p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Enterprise-grade security you can trust
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Your data is protected with industry-leading security standards
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SecurityBadge
                icon={<Lock className="h-8 w-8" />}
                title="SSL Encrypted"
                description="256-bit encryption"
              />
              <SecurityBadge
                icon={<Shield className="h-8 w-8" />}
                title="GDPR Compliant"
                description="EU data protection"
              />
              <SecurityBadge
                icon={<CheckCircle2 className="h-8 w-8" />}
                title="ISO 27001"
                description="Certified secure"
              />
              <SecurityBadge
                icon={<Award className="h-8 w-8" />}
                title="99.9% Uptime"
                description="SLA guaranteed"
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-worknest-teal to-teal-600 text-white rounded-2xl p-8 sm:p-16 mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to transform your HR management?
            </h2>
            <p className="text-lg sm:text-xl mb-8 text-teal-50 max-w-2xl mx-auto">
              Join 50+ companies already using WorkNest to streamline their workforce operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-worknest-teal hover:bg-slate-50 min-w-[200px] h-12 rounded-lg font-semibold text-lg shadow-xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-200 pt-12 pb-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Company */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Product</h3>
                <ul className="space-y-2 text-slate-600">
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Demo</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Updates</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Company</h3>
                <ul className="space-y-2 text-slate-600">
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">About</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Blog</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Resources</h3>
                <ul className="space-y-2 text-slate-600">
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">API Docs</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Community</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Status</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Legal</h3>
                <ul className="space-y-2 text-slate-600">
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Privacy</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Terms</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Security</Link></li>
                  <li><Link href="#" className="hover:text-worknest-teal transition-colors">Compliance</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-slate-200 gap-4">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                  <Image 
                    src="/worknest-logo.png" 
                    alt="WorkNest Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-slate-900">WorkNest</span>
              </div>
              
              <p className="text-sm text-slate-500 text-center">
                Powered by <span className="text-worknest-teal font-bold">TechOhns</span> | © 2024 All rights reserved | Lusaka, Zambia
              </p>
              
              {/* Social Links Placeholder */}
              <div className="flex gap-4">
                <Link href="#" className="text-slate-400 hover:text-worknest-teal transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </Link>
                <Link href="#" className="text-slate-400 hover:text-worknest-teal transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

function StatCard({ number, label, icon }: { number: string; label: string; icon?: React.ReactNode }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
      <CardContent className="pt-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-3xl sm:text-4xl font-bold text-slate-900">{number}</p>
          {icon}
        </div>
        <p className="text-sm text-slate-600 font-medium">{label}</p>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ quote, author, role, company, rating }: { 
  quote: string
  author: string
  role: string
  company: string
  rating: number
}) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-all">
      <CardContent className="pt-6">
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
          ))}
        </div>
        <p className="text-slate-700 mb-6 italic">"{quote}"</p>
        <div>
          <p className="font-semibold text-slate-900">{author}</p>
          <p className="text-sm text-slate-600">{role}</p>
          <p className="text-sm text-worknest-teal font-medium">{company}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="group relative bg-white border border-slate-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="h-12 w-12 bg-worknest-teal/10 text-worknest-teal group-hover:bg-worknest-teal group-hover:text-white rounded-lg flex items-center justify-center mb-4 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      
      {/* Hover Line Effect */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-worknest-teal transition-all duration-300 group-hover:w-full rounded-b-xl" />
    </div>
  )
}

function SecurityBadge({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-worknest-teal/20 text-worknest-teal mb-4">
        {icon}
      </div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  )
}