import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

// Logger utility
const logger = {
  error: (context: string, error: unknown) => {
    console.error(`[Supabase Admin Error - ${context}]:`, error)
  },
  warn: (context: string, message: string) => {
    console.warn(`[Supabase Admin Warning - ${context}]:`, message)
  },
  info: (context: string, message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Supabase Admin Info - ${context}]:`, message)
    }
  }
}

// Singleton pattern for admin client
let adminClientInstance: SupabaseClient<Database> | null = null

/**
 * Creates or returns existing Supabase Admin Client
 * 
 * This client uses the service role key and bypasses RLS.
 * ⚠️ WARNING: Only use this in server-side code, never expose to client!
 * 
 * Use cases:
 * - Server actions that need to bypass RLS
 * - Admin operations
 * - Background jobs
 * - Seeding/migration scripts
 * 
 * @returns SupabaseClient<Database> with admin privileges
 * @throws Error if environment variables are missing
 */
export function createAdminClient(): SupabaseClient<Database> {
  // Return existing instance if available (singleton pattern)
  if (adminClientInstance) {
    return adminClientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Validate environment variables
  if (!supabaseUrl) {
    const error = 'NEXT_PUBLIC_SUPABASE_URL is not defined'
    logger.error('createAdminClient', error)
    throw new Error(error)
  }

  if (!supabaseServiceKey) {
    const error = 'SUPABASE_SERVICE_ROLE_KEY is not defined'
    logger.error('createAdminClient', error)
    throw new Error(error)
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    const error = 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL'
    logger.error('createAdminClient', error)
    throw new Error(error)
  }

  logger.info('createAdminClient', 'Creating new admin client instance')

  try {
    adminClientInstance = createClient<Database>(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: {
            'X-Client-Info': 'worknest-admin-client',
          },
        },
      }
    )

    logger.info('createAdminClient', 'Admin client created successfully')
    return adminClientInstance
  } catch (error) {
    logger.error('createAdminClient', error)
    throw new Error('Failed to create Supabase admin client')
  }
}

/**
 * Reset the admin client instance (useful for testing)
 * ⚠️ For testing purposes only
 */
export function resetAdminClient(): void {
  adminClientInstance = null
  logger.info('resetAdminClient', 'Admin client instance reset')
}

/**
 * Typed helper for admin operations
 * Provides better type inference for common admin tasks
 */
export const adminClient = {
  /**
   * Get the admin client instance
   */
  get client(): SupabaseClient<Database> {
    return createAdminClient()
  },

  /**
   * Create a user with custom claims
   */
  async createUser(email: string, password: string, metadata?: {
    company_id?: string
    role?: Database['public']['Enums']['user_role']
    first_name?: string
    last_name?: string
  }) {
    try {
      logger.info('createUser', `Creating user: ${email}`)
      
      const { data, error } = await this.client.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata,
      })

      if (error) {
        logger.error('createUser', error)
        throw error
      }

      logger.info('createUser', `User created successfully: ${email}`)
      return { data, error: null }
    } catch (error) {
      logger.error('createUser', error)
      return { data: null, error }
    }
  },

  /**
   * Delete a user by ID
   */
  async deleteUser(userId: string) {
    try {
      logger.info('deleteUser', `Deleting user: ${userId}`)
      
      const { data, error } = await this.client.auth.admin.deleteUser(userId)

      if (error) {
        logger.error('deleteUser', error)
        throw error
      }

      logger.info('deleteUser', `User deleted successfully: ${userId}`)
      return { data, error: null }
    } catch (error) {
      logger.error('deleteUser', error)
      return { data: null, error }
    }
  },

  /**
   * Update user metadata
   */
  async updateUserMetadata(userId: string, metadata: Record<string, any>) {
    try {
      logger.info('updateUserMetadata', `Updating metadata for user: ${userId}`)
      
      const { data, error } = await this.client.auth.admin.updateUserById(
        userId,
        { user_metadata: metadata }
      )

      if (error) {
        logger.error('updateUserMetadata', error)
        throw error
      }

      logger.info('updateUserMetadata', `Metadata updated successfully`)
      return { data, error: null }
    } catch (error) {
      logger.error('updateUserMetadata', error)
      return { data: null, error }
    }
  },
}