// lib/api-gateway/rate-limiter.ts
import { NextRequest } from 'next/server'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
  resetIn: number
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Rate limiter using token bucket algorithm
 * In production, replace with Redis-based implementation
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Get identifier (IP address or user ID)
  const identifier = getIdentifier(request)
  const key = `ratelimit:${identifier}:${request.nextUrl.pathname}`
  
  const now = Date.now()
  const windowStart = now - config.windowMs
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetTime < now) {
    // Create new entry
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(key, entry)
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
      resetIn: entry.resetTime - now,
    }
  }
  
  // Increment counter
  entry.count++
  rateLimitStore.set(key, entry)
  
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetTime,
    resetIn: entry.resetTime - now,
  }
}

/**
 * Get unique identifier for rate limiting
 */
function getIdentifier(request: NextRequest): string {
  // Try to get user ID from cookie
  const userId = request.cookies.get('sb-user-id')?.value
  if (userId) return userId
  
  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip')
  
  return ip || 'unknown'
}

/**
 * Redis-based rate limiter (for production)
 * Uncomment and use with Redis
 */
/*
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export async function rateLimitRedis(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const identifier = getIdentifier(request)
  const key = `ratelimit:${identifier}:${request.nextUrl.pathname}`
  
  const now = Date.now()
  const windowStart = now - config.windowMs
  
  // Use Redis ZSET for sliding window
  const pipe = redis.pipeline()
  
  // Remove old entries
  pipe.zremrangebyscore(key, 0, windowStart)
  
  // Count requests in window
  pipe.zcard(key)
  
  // Add current request
  pipe.zadd(key, now, `${now}`)
  
  // Set expiration
  pipe.expire(key, Math.ceil(config.windowMs / 1000))
  
  const results = await pipe.exec()
  const count = results?.[1]?.[1] as number
  
  if (count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      reset: now + config.windowMs,
      resetIn: config.windowMs,
    }
  }
  
  return {
    success: true,
    remaining: config.maxRequests - count - 1,
    reset: now + config.windowMs,
    resetIn: config.windowMs,
  }
}
*/
