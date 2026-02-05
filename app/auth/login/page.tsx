'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('must_change_password, is_active')
        .eq('id', authData.user.id)
        .single()

      if (profileError) throw new Error('Failed to load profile')
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-xl bg-worknest-teal flex items-center justify-center">
              <span className="text-white font-bold text-2xl">WN</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome to WorkNest</CardTitle>
          <CardDescription className="text-center">Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="admin@worknest.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
            Powered by <span className="text-worknest-teal font-semibold">TechOhns</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}