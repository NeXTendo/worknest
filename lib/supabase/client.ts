import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

// Logger utility for browser
const logger = {
  error: (context: string, error: unknown) => {
    console.error(`[Supabase Client Error - ${context}]:`, error)
  },
  warn: (context: string, message: string) => {
    console.warn(`[Supabase Client Warning - ${context}]:`, message)
  },
  info: (context: string, message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Supabase Client Info - ${context}]:`, message)
    }
  }
}

// Singleton pattern for browser client
let browserClientInstance: SupabaseClient<Database> | null = null

/**
 * Creates or returns existing Supabase Browser Client
 * 
 * This client is used in React components and client-side code.
 * Features:
 * - Automatic session refresh
 * - Persistent sessions in browser storage
 * - Real-time subscriptions
 * - RLS enforced
 * 
 * @returns SupabaseClient<Database>
 * @throws Error if environment variables are missing
 */
async function handleLogout() {
  const res = await fetch('/api/logout', { method: 'POST' })
  const data = await res.json()

  if (data.success) {
    // Redirect to login
    window.location.href = '/auth/login'
  } else {
    console.error('Logout failed', data.error)
  }
}

export function createClient(): SupabaseClient<Database> {
  // Return existing instance if available (singleton pattern)
  if (browserClientInstance) {
    return browserClientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate environment variables
  if (!supabaseUrl) {
    const error = 'NEXT_PUBLIC_SUPABASE_URL is not defined'
    logger.error('createClient', error)
    throw new Error(error)
  }

  if (!supabaseAnonKey) {
    const error = 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined'
    logger.error('createClient', error)
    throw new Error(error)
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    const error = 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL'
    logger.error('createClient', error)
    throw new Error(error)
  }

  logger.info('createClient', 'Creating new browser client instance')

  try {
    browserClientInstance = createBrowserClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
        global: {
          headers: {
            'X-Client-Info': 'worknest-browser-client',
          },
        },
      }
    )

    logger.info('createClient', 'Browser client created successfully')
    return browserClientInstance
  } catch (error) {
    logger.error('createClient', error)
    throw new Error('Failed to create Supabase browser client')
  }
}

/**
 * Reset the browser client instance (useful for testing or logout)
 */
export function resetBrowserClient(): void {
  browserClientInstance = null
  logger.info('resetBrowserClient', 'Browser client instance reset')
}

/**
 * Helper to check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Typed helper for common client operations
 */
export const supabaseClient = {
  /**
   * Get the browser client instance
   */
  get client(): SupabaseClient<Database> {
    return createClient()
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    try {
      logger.info('signIn', `Signing in user: ${email}`)
      
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        logger.error('signIn', error)
        throw error
      }

      logger.info('signIn', 'Sign in successful')
      return { data, error: null }
    } catch (error) {
      logger.error('signIn', error)
      return { data: null, error }
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      logger.info('signOut', 'Signing out user')
      
      const { error } = await this.client.auth.signOut()

      if (error) {
        logger.error('signOut', error)
        throw error
      }

      // Clear the singleton instance on logout
      resetBrowserClient()
      
      logger.info('signOut', 'Sign out successful')
      return { error: null }
    } catch (error) {
      logger.error('signOut', error)
      return { error }
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data, error } = await this.client.auth.getSession()

      if (error) {
        logger.error('getSession', error)
        throw error
      }

      return { data, error: null }
    } catch (error) {
      logger.error('getSession', error)
      return { data: null, error }
    }
  },

  /**
   * Get current user
   */
  async getUser() {
    try {
      const { data, error } = await this.client.auth.getUser()

      if (error) {
        logger.error('getUser', error)
        throw error
      }

      return { data, error: null }
    } catch (error) {
      logger.error('getUser', error)
      return { data: null, error }
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword: string) {
    try {
      logger.info('updatePassword', 'Updating user password')
      
      const { data, error } = await this.client.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        logger.error('updatePassword', error)
        throw error
      }

      logger.info('updatePassword', 'Password updated successfully')
      return { data, error: null }
    } catch (error) {
      logger.error('updatePassword', error)
      return { data: null, error }
    }
  },

  /**
   * Send password reset email
   */
  async resetPasswordEmail(email: string) {
    try {
      logger.info('resetPasswordEmail', `Sending reset email to: ${email}`)
      
      const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        logger.error('resetPasswordEmail', error)
        throw error
      }

      logger.info('resetPasswordEmail', 'Reset email sent successfully')
      return { data, error: null }
    } catch (error) {
      logger.error('resetPasswordEmail', error)
      return { data: null, error }
    }
  },
}