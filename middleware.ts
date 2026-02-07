import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/lib/database.types'

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Routes that don't require authentication
  PUBLIC_ROUTES: ['/auth/login', '/auth/callback', '/auth/forgot-password'],
  
  // Routes that should be accessible even when password reset is required
  PASSWORD_RESET_ALLOWED_ROUTES: ['/auth/reset-password', '/auth/logout'],
  
  // Default redirect after login
  DEFAULT_DASHBOARD: '/dashboard/dashboard',
  
  // Enable/disable logging
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
} as const

// ============================================================================
// LOGGER
// ============================================================================

const logger = {
  info: (message: string, data?: any) => {
    if (CONFIG.ENABLE_LOGGING) {
      console.log(`[Middleware Info] ${message}`, data || '')
    }
  },
  warn: (message: string, data?: any) => {
    console.warn(`[Middleware Warning] ${message}`, data || '')
  },
  error: (message: string, error?: any) => {
    console.error(`[Middleware Error] ${message}`, error || '')
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true
  return CONFIG.PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Check if route is API route
 */
function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/')
}

/**
 * Check if route is auth route
 */
function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth')
}

/**
 * Check if static file or Next.js internal route
 */
function isStaticOrInternalRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Has file extension
  )
}

/**
 * Create redirect response with logging
 */
function createRedirect(
  request: NextRequest,
  destination: string,
  reason: string
): NextResponse {
  logger.info(`Redirecting to ${destination}`, { reason, from: request.nextUrl.pathname })
  return NextResponse.redirect(new URL(destination, request.url))
}

// ============================================================================
// MAIN MIDDLEWARE
// ============================================================================

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  logger.info(`Processing request: ${pathname}`)

  // Skip middleware for static files and Next.js internals
  if (isStaticOrInternalRoute(pathname)) {
    logger.info('Skipping middleware for static/internal route')
    return NextResponse.next()
  }

  // Initialize response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // ============================================================================
  // SUPABASE CLIENT SETUP
  // ============================================================================

  let supabase: ReturnType<typeof createServerClient<Database>>

  try {
    supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Set on request for subsequent middleware/route handlers
            request.cookies.set({ name, value, ...options })
            
            // Create new response with updated cookie
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            // Remove from request
            request.cookies.set({ name, value: '', ...options })
            
            // Create new response with removed cookie
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )
  } catch (error) {
    logger.error('Failed to create Supabase client', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }

  // ============================================================================
  // API ROUTES - Skip auth check, they handle their own
  // ============================================================================

  if (isApiRoute(pathname)) {
    logger.info('API route detected, passing through')
    return response
  }

  // ============================================================================
  // GET USER SESSION
  // ============================================================================

  let user: any = null
  let sessionError: any = null

  try {
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    user = authUser
    sessionError = error

    if (error) {
      logger.warn('Error getting user session', error)
    } else if (user) {
      logger.info('User authenticated', { userId: user.id, email: user.email })
    } else {
      logger.info('No authenticated user')
    }
  } catch (error) {
    logger.error('Exception while getting user', error)
    sessionError = error
  }

  // ============================================================================
  // PUBLIC ROUTES - Allow unauthenticated access
  // ============================================================================

  if (isPublicRoute(pathname)) {
    if (user) {
      // Allow authenticated users to view the landing page
      if (pathname === '/') {
        return response
      }

      // User is already authenticated, redirect to dashboard
      logger.info('Authenticated user accessing public route, redirecting to dashboard')
      return createRedirect(request, CONFIG.DEFAULT_DASHBOARD, 'Already authenticated')
    }
    logger.info('Public route, allowing access')
    return response
  }

  // ============================================================================
  // AUTH CALLBACK - Special handling
  // ============================================================================

  if (pathname === '/auth/callback') {
    // Let the callback route handle the session
    logger.info('Auth callback route, passing through')
    return response
  }

  // ============================================================================
  // UNAUTHENTICATED ACCESS - Redirect to login
  // ============================================================================

  if (!user) {
    logger.info('Unauthenticated user accessing protected route')
    
    // Save the intended destination for redirect after login
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    
    return createRedirect(request, redirectUrl.toString(), 'Authentication required')
  }

  // ============================================================================
  // GET USER PROFILE & CHECK PASSWORD RESET
  // ============================================================================

let profile: Pick<
  Database['public']['Tables']['profiles']['Row'],
  'must_change_password' | 'is_active' | 'role' | 'company_id'
> | null = null
let profileError: any = null

try {
  const { data, error } = await supabase
    .from('profiles')
    .select('must_change_password, is_active, role, company_id')
    .eq('id', user.id)
    .single<
      Pick<
        Database['public']['Tables']['profiles']['Row'],
        'must_change_password' | 'is_active' | 'role' | 'company_id'
      >
    >()

  profile = data
  profileError = error

  if (error) {
    logger.error('Error fetching user profile', error)
  } else if (data) {
    logger.info('Profile loaded', {
      role: data.role,
      mustChangePassword: data.must_change_password,
      isActive: data.is_active,
      companyId: data.company_id
    })
  }
} catch (error) {
  logger.error('Exception while fetching profile', error)
  profileError = error
}


  // ============================================================================
  // PROFILE ERROR HANDLING
  // ============================================================================

  if (profileError || !profile) {
    logger.error('Profile not found or error occurred', { userId: user.id })
    
    // If profile doesn't exist or can't be loaded, sign out user
    await supabase.auth.signOut()
    return createRedirect(request, '/auth/login', 'Profile not found')
  }

  // ============================================================================
  // CHECK IF USER IS ACTIVE
  // ============================================================================

  if (!profile.is_active) {
    logger.warn('Inactive user attempting access', { userId: user.id })
    await supabase.auth.signOut()
    return createRedirect(request, '/auth/login?error=account_inactive', 'Account inactive')
  }

  // ============================================================================
  // HANDLE AUTH ROUTES FOR AUTHENTICATED USERS
  // ============================================================================

  if (isAuthRoute(pathname)) {
    // User is authenticated
    
    // If they need to reset password
    if (profile.must_change_password) {
      // Only allow access to password reset page and logout
      if (CONFIG.PASSWORD_RESET_ALLOWED_ROUTES.some(route => pathname.startsWith(route))) {
        logger.info('Allowing access to password reset route')
        return response
      }
      
      // Redirect to password reset
      return createRedirect(request, '/auth/reset-password', 'Password reset required')
    }

    // User doesn't need password reset, redirect to dashboard
    logger.info('Authenticated user on auth route, redirecting to dashboard')
    return createRedirect(request, CONFIG.DEFAULT_DASHBOARD, 'Already authenticated')
  }

  // ============================================================================
  // PASSWORD RESET ENFORCEMENT
  // ============================================================================

  if (profile.must_change_password) {
    // User must change password
    
    // Allow access only to password reset and logout routes
    if (CONFIG.PASSWORD_RESET_ALLOWED_ROUTES.some(route => pathname.startsWith(route))) {
      logger.info('User accessing allowed route despite password reset requirement')
      return response
    }

    // Redirect to password reset
    logger.info('Enforcing password reset')
    return createRedirect(request, '/auth/reset-password', 'Password reset required')
  }

  // ============================================================================
  // ROLE-BASED ACCESS CONTROL (Optional - implement if needed)
  // ============================================================================

  // Example: Block certain routes based on role
  // if (pathname.startsWith('/platform') && profile.role !== 'super_admin') {
  //   logger.warn('Unauthorized access attempt to platform routes', { role: profile.role })
  //   return createRedirect(request, CONFIG.DEFAULT_DASHBOARD, 'Insufficient permissions')
  // }

  // ============================================================================
  // UPDATE LAST LOGIN (Optional)
  // ============================================================================

  // Uncomment to track last login time
  // try {
  //   await supabase
  //     .from('profiles')
  //     .update({ last_login: new Date().toISOString() })
  //     .eq('id', user.id)
  // } catch (error) {
  //   logger.error('Failed to update last login', error)
  //   // Non-critical, continue
  // }

  // ============================================================================
  // ADD CUSTOM HEADERS (Optional)
  // ============================================================================

  // Add user info to headers for downstream route handlers
  response.headers.set('X-User-Id', user.id)
  response.headers.set('X-User-Role', profile.role)
  if (profile.company_id) {
    response.headers.set('X-Company-Id', profile.company_id)
  }

  logger.info('Access granted', { userId: user.id, role: profile.role })

  return response
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (*.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}