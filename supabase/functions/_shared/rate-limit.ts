// Simple in-memory rate limiter for Edge Functions
// For production with multiple regions, use Upstash Redis (see rate-limit-config.md)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (resets when function cold-starts)
const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Check if a request is within rate limits
 * @param key - Unique identifier (IP, phone number, user ID, etc.)
 * @param limit - Max requests allowed in the window
 * @param windowSeconds - Time window in seconds (default: 60)
 * @returns RateLimitResult
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance on each check
    cleanupExpiredEntries(now);
  }
  
  let entry = store.get(key);
  
  // Initialize or reset if window expired
  if (!entry || now >= entry.resetAt) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, entry);
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: entry.resetAt,
    };
  }
  
  // Increment count
  entry.count++;
  
  // Check if over limit
  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter,
    };
  }
  
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries(now: number) {
  const keysToDelete: string[] = [];
  
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) {
      keysToDelete.push(key);
    }
  }
  
  for (const key of keysToDelete) {
    store.delete(key);
  }
  
  if (keysToDelete.length > 0) {
    console.log(`Cleaned up ${keysToDelete.length} expired rate limit entries`);
  }
}

/**
 * Get rate limit key from request
 * Priority: Forwarded IP > Real IP > User Agent hash
 */
export function getRateLimitKey(req: Request, prefix: string = ''): string {
  // Try to get IP from headers (behind proxy)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0].trim();
    return prefix ? `${prefix}:${ip}` : ip;
  }
  
  // Fallback to user agent hash (less reliable)
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const hash = simpleHash(userAgent);
  return prefix ? `${prefix}:${hash}` : `ua:${hash}`;
}

/**
 * Simple hash function for user agent
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Create a rate limit response
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: `Too many requests. Please try again in ${result.retryAfter} seconds.`,
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': result.retryAfter?.toString() || '60',
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
      },
    }
  );
}

/**
 * Example usage in Edge Function:
 * 
 * import { checkRateLimit, getRateLimitKey, rateLimitResponse } from '../_shared/rate-limit.ts';
 * 
 * serve(async (req) => {
 *   const key = getRateLimitKey(req, 'twilio-sms');
 *   const result = checkRateLimit(key, 60, 60); // 60 requests per 60 seconds
 *   
 *   if (!result.allowed) {
 *     console.warn('Rate limit exceeded:', key);
 *     return rateLimitResponse(result);
 *   }
 *   
 *   // Process request...
 * });
 */
