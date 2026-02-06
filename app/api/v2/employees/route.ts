// app/api/employees/route.ts
import { apiGateway, requirePermission, ApiContext, ApiResponse } from '@/lib/api-gateway/middleware'
import { NextRequest } from 'next/server'

/**
 * GET /api/employees
 * List all employees
 */
export async function GET(request: NextRequest) {
  return apiGateway(request, async (ctx: ApiContext): Promise<ApiResponse> => {
    // Check permissions
    if (!requirePermission(ctx, 'view')) {
      return {
        success: false,
        error: 'Insufficient permissions',
        message: 'You do not have permission to view employees',
      }
    }

    try {
      // Get query parameters
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const status = searchParams.get('status')
      const search = searchParams.get('search')

      // Build query
      let query = ctx.supabase
        .from('employees')
        .select('*', { count: 'exact' })
        .eq('company_id', ctx.user.company_id)
        .order('created_at', { ascending: false })

      // Apply filters
      if (status) {
        query = query.eq('employment_status', status)
      }

      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      // Pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        success: true,
        data,
        meta: {
          page,
          limit,
          total: count || 0,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: 'Failed to fetch employees',
        message: error.message,
      }
    }
  })
}

/**
 * POST /api/employees
 * Create a new employee
 */
export async function POST(request: NextRequest) {
  return apiGateway(request, async (ctx: ApiContext): Promise<ApiResponse> => {
    // Check permissions
    if (!requirePermission(ctx, 'create')) {
      return {
        success: false,
        error: 'Insufficient permissions',
        message: 'You do not have permission to create employees',
      }
    }

    try {
      const body = await request.json()

      // Create employee
      const { data, error } = await ctx.supabase
        .from('employees')
        .insert({
          ...body,
          company_id: ctx.user.company_id,
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Employee created successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: 'Failed to create employee',
        message: error.message,
      }
    }
  })
}
