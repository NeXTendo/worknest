import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database, Profile, Company } from '@/lib/database.types'

// Logger utility
const logger = {
  error: (context: string, error: unknown) => {
    console.error(`[Supabase Server Error - ${context}]:`, error)
  },
  warn: (context: string, message: string) => {
    console.warn(`[Supabase Server Warning - ${context}]:`, message)
  },
  info: (context: string, message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Supabase Server Info - ${context}]:`, message)
    }
  }
}

/**
 * Creates a Supabase Server Client for use in Server Components, Server Actions, and Route Handlers
 * 
 * Features:
 * - Cookie-based session management
 * - Works with Next.js App Router
 * - RLS enforced
 * - Automatic session refresh
 * 
 * @returns SupabaseClient<Database>
 * @throws Error if environment variables are missing or cookie operations fail
 */
export function createServerSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate environment variables
  if (!supabaseUrl) {
    const error = 'NEXT_PUBLIC_SUPABASE_URL is not defined'
    logger.error('createServerSupabaseClient', error)
    throw new Error(error)
  }

  if (!supabaseAnonKey) {
    const error = 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined'
    logger.error('createServerSupabaseClient', error)
    throw new Error(error)
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    const error = 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL'
    logger.error('createServerSupabaseClient', error)
    throw new Error(error)
  }

  let cookieStore: ReturnType<typeof cookies>
  
  try {
    cookieStore = cookies()
  } catch (error) {
    logger.error('createServerSupabaseClient', 'Failed to access cookies')
    throw new Error('Failed to access cookies. This function must be called in a Server Component or Server Action.')
  }

  logger.info('createServerSupabaseClient', 'Creating new server client instance')

  try {
    const client = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            try {
              const value = cookieStore.get(name)?.value
              logger.info('cookies.get', `Getting cookie: ${name}`)
              return value
            } catch (error) {
              logger.error('cookies.get', error)
              return undefined
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              logger.info('cookies.set', `Setting cookie: ${name}`)
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Cookie setting can fail in middleware or during static generation
              // This is expected and can be safely ignored
              logger.warn('cookies.set', `Failed to set cookie: ${name}. This is expected in middleware.`)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              logger.info('cookies.remove', `Removing cookie: ${name}`)
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Cookie removal can fail in middleware or during static generation
              logger.warn('cookies.remove', `Failed to remove cookie: ${name}. This is expected in middleware.`)
            }
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false, // We handle this in middleware
        },
        global: {
          headers: {
            'X-Client-Info': 'worknest-server-client',
          },
        },
        db: {
          schema: 'public',
        },
      }
    )

    logger.info('createServerSupabaseClient', 'Server client created successfully')
    return client
  } catch (error) {
    logger.error('createServerSupabaseClient', error)
    throw new Error('Failed to create Supabase server client')
  }
}

/**
 * Typed helper for common server operations
 * Provides better type inference and error handling
 */
export const serverClient = {
  /**
   * Get the server client instance
   */
  get client(): SupabaseClient<Database> {
    return createServerSupabaseClient()
  },

  /**
   * Get current authenticated user
   * Returns null if no user is authenticated
   */
  async getUser() {
    try {
      const { data: { user }, error } = await this.client.auth.getUser()

      if (error) {
        logger.error('getUser', error)
        return { user: null, error }
      }

      return { user, error: null }
    } catch (error) {
      logger.error('getUser', error)
      return { user: null, error }
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await this.client.auth.getSession()

      if (error) {
        logger.error('getSession', error)
        return { session: null, error }
      }

      return { session, error: null }
    } catch (error) {
      logger.error('getSession', error)
      return { session: null, error }
    }
  },

  /**
   * Get user profile with type safety
   */
  async getUserProfile(userId: string) {
    try {
      logger.info('getUserProfile', `Fetching profile for user: ${userId}`)
      
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        logger.error('getUserProfile', error)
        throw error
      }

      logger.info('getUserProfile', 'Profile fetched successfully')
      return { data: data as Profile, error: null }
    } catch (error) {
      logger.error('getUserProfile', error)
      return { data: null, error }
    }
  },

  /**
   * Get user's company
   */
  async getUserCompany(companyId: string) {
    try {
      logger.info('getUserCompany', `Fetching company: ${companyId}`)
      
      const { data, error } = await this.client
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()

      if (error) {
        logger.error('getUserCompany', error)
        throw error
      }

      logger.info('getUserCompany', 'Company fetched successfully')
      return { data: data as Company, error: null }
    } catch (error) {
      logger.error('getUserCompany', error)
      return { data: null, error }
    }
  },

  /**
   * Check if user has specific role
   */
  async hasRole(userId: string, roles: Database['public']['Enums']['user_role'][]): Promise<boolean> {
    try {
      const { data, error } = await this.getUserProfile(userId)
      
      if (error || !data) {
        return false
      }

      return roles.includes(data.role)
    } catch (error) {
      logger.error('hasRole', error)
      return false
    }
  },

  /**
   * Check if user is admin (main_admin or hr_admin)
   */
  async isAdmin(userId: string): Promise<boolean> {
    return this.hasRole(userId, ['main_admin', 'hr_admin', 'super_admin'])
  },

  /**
   * Check if user belongs to company
   */
  async belongsToCompany(userId: string, companyId: string): Promise<boolean> {
    try {
      const { data, error } = await this.getUserProfile(userId)
      
      if (error || !data) {
        return false
      }

      return data.company_id === companyId
    } catch (error) {
      logger.error('belongsToCompany', error)
      return false
    }
  },
}

/**
 * Wrapper for server actions with automatic error handling
 */
export async function withServerClient<T>(
  callback: (client: SupabaseClient<Database>) => Promise<T>
): Promise<{ data: T | null; error: any }> {
  try {
    const client = createServerSupabaseClient()
    const data = await callback(client)
    return { data, error: null }
  } catch (error) {
    logger.error('withServerClient', error)
    return { data: null, error }
  }
}