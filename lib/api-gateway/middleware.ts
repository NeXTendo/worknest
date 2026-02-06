// lib/api-gateway/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types'
import { rateLimit } from './rate-limiter'
import { logApiRequest } from './logger'
import { validateRequest } from './validator'
import { fetchRecord } from '@/lib/supabase/rpc-helpers'

export interface ApiContext {
  user: {
    id: string
    email: string | undefined
    role: string
    company_id: string
  }
  supabase: ReturnType<typeof createServerClient<Database>>
  request: NextRequest
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

// Rate limiting configuration
const rateLimitConfig = {
  '/api/auth/login': { maxRequests: 5, windowMs: 60000 }, // 5 requests per minute
  '/api/auth/logout': { maxRequests: 10, windowMs: 60000 },
  '/api/employees': { maxRequests: 100, windowMs: 60000 },
  '/api/qr': { maxRequests: 50, windowMs: 60000 },
  default: { maxRequests: 60, windowMs: 60000 }, // 60 requests per minute default
}

// Public routes that don't require authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/callback',
  '/api/health',
]

/**
 * Main API Gateway middleware
 * Handles authentication, authorization, rate limiting, validation, and logging
 */
export async function apiGateway(
  request: NextRequest,
  handler: (ctx: ApiContext) => Promise<NextResponse | ApiResponse>
): Promise<NextResponse> {
  const startTime = Date.now()
  const pathname = request.nextUrl.pathname

  try {
    // 1. RATE LIMITING
    const limiter = rateLimitConfig[pathname as keyof typeof rateLimitConfig] || rateLimitConfig.default
    const rateLimitResult = await rateLimit(request, limiter)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil(rateLimitResult.resetIn / 1000)} seconds`,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limiter.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil(rateLimitResult.resetIn / 1000).toString(),
          },
        }
      )
    }

    // 2. CORS HEADERS
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return NextResponse.json({}, { status: 200, headers: corsHeaders })
    }

    // 3. CREATE SUPABASE CLIENT
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set() {}, // Not needed in middleware
          remove() {}, // Not needed in middleware
        },
      }
    )

    // 4. AUTHENTICATION (skip for public routes)
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
    
    let user: ApiContext['user'] | null = null

    if (!isPublicRoute) {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized',
            message: 'Authentication required',
          },
          { status: 401, headers: corsHeaders }
        )
      }

      // Fetch user profile for role and company
      // Fetch user profile for role and company
      const { data: profile, error: profileError } = await fetchRecord(
        supabase,
        'profiles',
        authUser.id
      )

      if (profileError || !profile) {
        return NextResponse.json(
          {
            success: false,
            error: 'Profile not found',
            message: 'User profile could not be loaded',
          },
          { status: 403, headers: corsHeaders }
        )
      }

      if (!profile.is_active) {
        return NextResponse.json(
          {
            success: false,
            error: 'Account deactivated',
            message: 'Your account has been deactivated',
          },
          { status: 403, headers: corsHeaders }
        )
      }

      if (!profile.company_id) {
        return NextResponse.json(
          {
            success: false,
            error: 'No company assigned',
            message: 'User is not associated with any company',
          },
          { status: 403, headers: corsHeaders }
        )
      }

      user = {
        id: authUser.id,
        email: authUser.email,
        role: profile.role,
        company_id: profile.company_id,
      }
    }

    // 5. REQUEST VALIDATION (for POST/PUT/PATCH)
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const validationResult = await validateRequest(request, pathname)
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            message: validationResult.error,
          },
          { status: 400, headers: corsHeaders }
        )
      }
    }

    // 6. EXECUTE HANDLER
    const context: ApiContext = {
      user: user!,
      supabase,
      request,
    }

    const result = await handler(context)

    // 7. LOG REQUEST
    const duration = Date.now() - startTime
    await logApiRequest({
      method: request.method,
      path: pathname,
      userId: user?.id,
      companyId: user?.company_id,
      duration,
      status: 'success',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    })

    // 8. FORMAT RESPONSE
    if (result instanceof NextResponse) {
      // Add CORS headers to existing response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        result.headers.set(key, value)
      })
      return result
    }

    // Convert ApiResponse to NextResponse
    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
      headers: corsHeaders,
    })

  } catch (error: any) {
    // ERROR HANDLING
    console.error('API Gateway Error:', error)

    const duration = Date.now() - startTime
    await logApiRequest({
      method: request.method,
      path: pathname,
      userId: undefined,
      companyId: undefined,
      duration,
      status: 'error',
      error: error.message,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      },
      { status: 500 }
    )
  }
}

/**
 * Helper to check if user has required role
 */
export function requireRole(ctx: ApiContext, allowedRoles: string[]): boolean {
  return allowedRoles.includes(ctx.user.role)
}

/**
 * Helper to check if user has permission for a resource
 */
export function requirePermission(
  ctx: ApiContext,
  permission: 'view' | 'create' | 'edit' | 'delete'
): boolean {
  const rolePermissions = {
    super_admin: ['view', 'create', 'edit', 'delete'],
    main_admin: ['view', 'create', 'edit', 'delete'],
    hr_admin: ['view', 'create', 'edit', 'delete'],
    manager: ['view', 'create', 'edit'],
    employee: ['view'],
  }

  const userPermissions = rolePermissions[ctx.user.role as keyof typeof rolePermissions] || []
  return userPermissions.includes(permission)
}
