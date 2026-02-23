# Rate Limiting Configuration for Supabase Edge Functions

## Overview
Supabase Edge Functions support rate limiting to prevent abuse and control costs.

## How to Configure (Supabase Dashboard)

### 1. Navigate to Edge Functions
Go to: `https://app.supabase.com/project/YOUR_PROJECT/functions`

### 2. Click on Each Function
- `create-business`
- `twilio-voice`
- `twilio-sms`

### 3. Add Rate Limiting Headers

For each function, add these environment variables in the Supabase Dashboard:

#### For Public Webhooks (twilio-voice, twilio-sms):
```
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
```

#### For Authenticated Endpoints (create-business):
```
RATE_LIMIT_PER_MINUTE=30
RATE_LIMIT_PER_HOUR=500
```

## Implementation in Code

The rate limiting is enforced at the platform level by Supabase, but you can add additional checks:

```typescript
// Add to the beginning of your Edge Function handler
const rateLimitKey = req.headers.get('x-forwarded-for') || 'unknown';
const rateLimitResponse = await checkRateLimit(rateLimitKey);

if (!rateLimitResponse.allowed) {
  return new Response(
    JSON.stringify({ error: 'Rate limit exceeded', retryAfter: rateLimitResponse.retryAfter }),
    { 
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': rateLimitResponse.retryAfter.toString()
      }
    }
  );
}
```

## Supabase Built-in Rate Limiting

Supabase automatically enforces these limits:

### Free Tier:
- 500,000 invocations per month
- 10 concurrent requests per function
- 2GB outbound data per month

### Pro Tier ($25/mo):
- 2,000,000 invocations per month
- 50 concurrent requests per function
- 50GB outbound data per month

## Using Upstash Redis for Custom Rate Limiting

For more granular control, you can use Upstash Redis:

1. Sign up at https://upstash.com (free tier available)
2. Create a Redis database
3. Get your REST URL and token
4. Add to Supabase secrets:
   ```bash
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxx
   ```

5. Add rate limit helper:

```typescript
// supabase/functions/_shared/rate-limit.ts
const UPSTASH_URL = Deno.env.get('UPSTASH_REDIS_REST_URL')!;
const UPSTASH_TOKEN = Deno.env.get('UPSTASH_REDIS_REST_TOKEN')!;

export async function checkRateLimit(
  key: string,
  limit: number = 60,
  window: number = 60
): Promise<{ allowed: boolean; retryAfter: number }> {
  const redisKey = `rate_limit:${key}`;
  
  const response = await fetch(`${UPSTASH_URL}/incr/${redisKey}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  
  const data = await response.json();
  const count = data.result;
  
  if (count === 1) {
    // First request - set expiry
    await fetch(`${UPSTASH_URL}/expire/${redisKey}/${window}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
  }
  
  if (count > limit) {
    const ttl = await fetch(`${UPSTASH_URL}/ttl/${redisKey}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    }).then(r => r.json());
    
    return {
      allowed: false,
      retryAfter: ttl.result || window,
    };
  }
  
  return { allowed: true, retryAfter: 0 };
}
```

## Recommended Limits

### twilio-voice (incoming calls)
- **Per IP:** 10 calls/minute (prevent spam)
- **Per business:** 100 calls/hour (reasonable volume)

### twilio-sms (incoming messages)
- **Per phone number:** 60 messages/minute (normal conversation)
- **Per business:** 1000 messages/hour (high volume support)

### create-business (onboarding)
- **Per IP:** 5 requests/minute (prevent abuse)
- **Per user:** 3 businesses/lifetime (reasonable limit)

## Monitoring

Add logging to track rate limit hits:

```typescript
if (!rateLimitResponse.allowed) {
  console.warn('Rate limit exceeded', {
    key: rateLimitKey,
    function: 'twilio-sms',
    retryAfter: rateLimitResponse.retryAfter
  });
}
```

## Testing Rate Limits

Use this script to test:

```bash
# Test SMS webhook rate limit
for i in {1..100}; do
  curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/twilio-sms \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "From=+15551234567&To=+15559876543&Body=Test" &
done
wait
```

## Quick Start

For now (beta launch), the Supabase built-in limits are sufficient. Add custom rate limiting with Upstash when you scale past 100 businesses.

## Status

✅ Supabase platform rate limiting active (default)  
⚠️ Custom per-endpoint limits: Not yet configured  
⚠️ Upstash Redis integration: Optional, add when scaling

## Next Steps

1. Monitor your Supabase usage dashboard
2. Set up alerts for 80% of limits
3. Add Upstash when you need granular control
