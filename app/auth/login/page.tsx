'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { fetchRecord } from '@/lib/supabase/rpc-helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Login failed')

      // Use fetchRecord helper to avoid strict type inference issues
      const { data: profile, error: profileError } = await fetchRecord(
        supabase,
        'profiles',
        authData.user.id
      )

      if (profileError || !profile) throw new Error('Failed to load profile')
      if (!profile.is_active) {
        await supabase.auth.signOut()
        throw new Error('Your account is deactivated')
      }

      if (profile.must_change_password) {
        router.push('/auth/reset-password')
        return
      }

      router.push('/dashboard/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1.5fr,1fr] bg-white">
      {/* Left Column - Branding/Image */}
      <div className="hidden lg:flex relative bg-slate-900 items-center justify-center overflow-hidden">
        {/* Background Gradient/Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Animated Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-worknest-teal/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-2xl">
          <div className="relative h-32 w-32 mb-8">
             <Image 
                src="/worknest-logo.png" 
                alt="WorkNest Logo" 
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">Home to every workforce</h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Streamline your HR operations with our comprehensive management solution. 
            Experience the future of workforce administration.
          </p>
        </div>

        {/* Floating elements decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>

      {/* Right Column - Form */}
      <div className="flex items-center justify-center p-8 bg-white relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden absolute top-0 left-0 w-full p-4 flex items-center gap-2">
           <div className="relative h-8 w-8">
              <Image src="/worknest-logo.png" alt="Logo" fill className="object-contain" />
           </div>
           <span className="font-bold text-slate-900">WorkNest</span>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-md font-medium flex items-center gap-2 animate-fade-in">
                 <span className="block h-1.5 w-1.5 rounded-full bg-rose-600" />
                 {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password"className="text-slate-700 font-medium">Password</Label>
                  <Link href="/auth/forgot-password" className="text-sm font-medium text-worknest-teal hover:underline" tabIndex={-1}>
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all font-medium"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all duration-300 rounded-lg" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                   <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Authenticating...
                </span>
              ) : 'Sign In to Dashboard'}
            </Button>
          </form>

          <div className="pt-8 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-500">
               Don&apos;t have an account? <Link href="/" className="font-semibold text-slate-900 hover:underline">Contact Support</Link>
             </p>
             <div className="mt-8 text-xs text-slate-400">
               Powered by <span className="text-worknest-teal font-semibold">TechOhns</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}