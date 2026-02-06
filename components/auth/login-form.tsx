'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, LogIn, Loader2 } from 'lucide-react'
import { fetchRecord } from '@/lib/supabase/rpc-helpers'

interface LoginFormProps {
  redirectTo?: string // optional redirect after login
}

export default function LoginForm({ redirectTo = '/dashboard' }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!identifier || !password) {
        setError('Please enter your email, username, or employee ID and password.')
        return
      }

      // Attempt login via Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: identifier.trim(),
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Login failed - no user returned')

      // Fetch profile
      const { data: profile, error: profileError } = await fetchRecord(
        supabase,
        'profiles',
        authData.user.id
      )

      if (profileError) throw profileError
      if (!profile) throw new Error('Profile not found')

      if (!profile.is_active) {
        await supabase.auth.signOut()
        throw new Error('Your account has been deactivated. Please contact support.')
      }

      if (profile.must_change_password) {
        router.push('/auth/reset-password')
        return
      }

      // Success
      router.push(redirectTo)
      router.refresh()
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Login failed</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="identifier">Email, Username, or Employee ID</Label>
        <Input
          id="identifier"
          type="text"
          placeholder="admin@company.com or EMP001"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          disabled={loading}
          autoComplete="email"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/auth/reset-password"
            className="text-sm text-worknest-teal hover:underline"
            tabIndex={-1}
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </>
        )}
      </Button>
    </form>
  )
}
