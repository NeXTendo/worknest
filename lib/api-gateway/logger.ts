// lib/api-gateway/logger.ts
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

interface LogEntry {
  method: string
  path: string
  userId?: string
  companyId?: string
  duration: number
  status: 'success' | 'error'
  error?: string
  ip?: string | null
}

/**
 * Log API request to database
 */
export async function logApiRequest(entry: LogEntry): Promise<void> {
  try {
    // In production, you might want to use a dedicated logging service
    // like Datadog, New Relic, or CloudWatch
    
    if (process.env.ENABLE_API_LOGGING !== 'true') {
      return
    }
    
    // For now, we'll use console logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[API]', {
        timestamp: new Date().toISOString(),
        ...entry,
      })
    }
    
    // Optional: Store in Supabase audit_logs table
    if (process.env.ENABLE_DB_LOGGING === 'true') {
      const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            get: () => undefined,
            set: () => {},
            remove: () => {},
          },
        }
      )
      
      await supabase.from('audit_logs').insert({
        company_id: entry.companyId,
        user_id: entry.userId,
        action: `API_${entry.method}`,
        table_name: 'api_requests',
        old_values: null,
        new_values: {
          path: entry.path,
          duration: entry.duration,
          status: entry.status,
          error: entry.error,
        },
        ip_address: entry.ip,
        user_agent: null,
      })
    }
    
  } catch (error) {
    // Don't throw - logging should never break the app
    console.error('Logging error:', error)
  }
}

/**
 * Log error with context
 */
export function logError(error: Error, context?: Record<string, any>): void {
  console.error('[ERROR]', {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    ...context,
  })
  
  // In production, send to error tracking service
  // e.g., Sentry, Rollbar, etc.
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    // Sentry.captureException(error, { extra: context })
  }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private startTime: number
  private checkpoints: Map<string, number>
  
  constructor() {
    this.startTime = Date.now()
    this.checkpoints = new Map()
  }
  
  checkpoint(name: string): void {
    this.checkpoints.set(name, Date.now() - this.startTime)
  }
  
  getReport(): Record<string, number> {
    return {
      total: Date.now() - this.startTime,
      ...Object.fromEntries(this.checkpoints),
    }
  }
  
  log(context?: string): void {
    const report = this.getReport()
    console.log(`[PERF${context ? ` ${context}` : ''}]`, report)
  }
}
