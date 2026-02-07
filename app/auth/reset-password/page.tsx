'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error: profileError } = await (supabase
          .from('profiles') as any)
          .update({ must_change_password: false })
          .eq('id', user.id)

        if (profileError) throw profileError
      }

      // Redirect to dashboard after successful password update
      router.push('/dashboard/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1.5fr,1fr] bg-white">
      {/* Left Column - Branding/Image */}
      <div className="hidden lg:flex relative bg-slate-900 items-center justify-center overflow-hidden">
        {/* Background Gradient/Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Animated Blob */}
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-worknest-teal/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-2xl">
          <div className="relative h-24 w-24 mb-6 opacity-80 hover:opacity-100 transition-opacity">
             <Image 
                src="/worknest-logo.png" 
                alt="WorkNest Logo" 
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Secure Access Recovery</h2>
          <p className="text-slate-400">
            Create a strong new password to protect your account.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex items-center justify-center p-8 bg-white relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-0 left-0 w-full p-4 flex items-center gap-2">
           <Link href="/" className="flex items-center gap-2">
             <div className="relative h-8 w-8">
                <Image src="/worknest-logo.png" alt="Logo" fill className="object-contain" />
             </div>
             <span className="font-bold text-slate-900">WorkNest</span>
           </Link>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Reset Password</h2>
            <p className="text-slate-500 mt-2">Enter your new credentials below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-md font-medium text-center animate-fade-in">
                {error}
              </p>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-slate-700 font-medium">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                   Updating...
                </span>
              ) : 'Update Password'}
            </Button>
          </form>
          
          <div className="pt-8 border-t border-slate-100 text-center">
            <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-worknest-teal hover:underline">
              Back to Login
            </Link>
             <div className="mt-8 text-xs text-slate-400">
               Powered by <span className="text-worknest-teal font-semibold">TechOhns</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}