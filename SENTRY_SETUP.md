# Sentry Error Tracking Setup

## What is Sentry?

Sentry automatically catches and reports errors in your app so you know when things break in production. It's free for up to 5,000 errors/month.

---

## Quick Setup (5 minutes)

### 1. Create a Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up with GitHub or email
3. Create a new project → Select **React**
4. Copy your DSN (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)

### 2. Add DSN to Your Environment

**For local development:**
```bash
# .env.local
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_ENVIRONMENT=development
```

**For Vercel production:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `VITE_SENTRY_DSN` = your Sentry DSN
   - `VITE_ENVIRONMENT` = `production`

### 3. Install Dependencies

```bash
npm install
```

(Already added to package.json: `@sentry/react`)

### 4. Test It

**In development (console only):**
```jsx
// Add this to any component to test
<button onClick={() => { throw new Error('Test error!'); }}>
  Trigger Error
</button>
```

You'll see the error logged to console with "Sentry would have sent:" message.

**In production:**
Same button will send the error to Sentry and you'll see it in your dashboard.

---

## What's Already Set Up ✅

✅ **Sentry initialization** (`src/lib/sentry.js`)  
✅ **Error boundary** (`src/components/ErrorBoundary.jsx`)  
✅ **App wrapped** (`src/main.jsx`)  
✅ **User tracking** (`src/context/AuthContext.jsx`)  
✅ **Sensitive data filtering** (passwords, tokens, API keys removed from errors)  
✅ **Performance monitoring** (tracks slow page loads)  
✅ **Session replay** (on errors only, privacy-safe)

---

## What Gets Tracked

### Automatically Tracked:
- ✅ React component errors (caught by ErrorBoundary)
- ✅ Unhandled promise rejections
- ✅ Console errors in production
- ✅ Network request failures
- ✅ Page load performance
- ✅ User sessions (when errors occur)

### What's Filtered Out:
- ❌ Browser extension errors
- ❌ Network errors (too common, not actionable)
- ❌ User cancellations (AbortError)
- ❌ Supabase auth errors (handled gracefully)
- ❌ Development errors (only logged to console)

### Privacy & Security:
- 🔒 Passwords/tokens automatically scrubbed from error data
- 🔒 Session replays have all text masked by default
- 🔒 User emails tracked, but no sensitive PII
- 🔒 Only captures 10% of normal sessions, 100% with errors

---

## Manually Tracking Errors

### In React Components:

```jsx
import { captureError } from '../lib/sentry';

try {
  await riskyOperation();
} catch (error) {
  captureError(error, {
    operation: 'riskyOperation',
    userId: user.id,
    businessId: business.id,
  });
  
  // Show user-friendly error message
  setError('Something went wrong. Please try again.');
}
```

### Adding Breadcrumbs (for debugging):

```jsx
import { addBreadcrumb } from '../lib/sentry';

// Log important user actions
addBreadcrumb('User clicked "Create Lead"', {
  leadData: { phone: customer.phone, source: 'manual' },
});

// Later, if an error occurs, Sentry will show this breadcrumb
```

### Performance Tracking:

```jsx
import { startTransaction } from '../lib/sentry';

const transaction = startTransaction('AI Response Generation', 'ai');

try {
  const response = await generateAIResponse(message);
  transaction?.finish();
} catch (error) {
  transaction?.finish();
  throw error;
}
```

---

## Viewing Errors in Sentry

### Dashboard: https://sentry.io

**Issues Tab:**
- See all errors grouped by type
- Click an error to see:
  - Full stack trace
  - User info (email, ID)
  - Breadcrumbs (what user did before error)
  - Device/browser info
  - Session replay (if error occurred)

**Performance Tab:**
- See slow page loads
- Identify performance bottlenecks
- Track API response times

**Alerts:**
- Get Slack/email notifications for new errors
- Set up alerts for critical errors (e.g., payment failures)

---

## Cost & Limits

### Free Tier (Included):
- ✅ 5,000 errors/month
- ✅ 10,000 performance events/month
- ✅ 50 session replays/month
- ✅ 30-day data retention
- ✅ Unlimited projects

**Estimate for BookFox:**
- With 100 users and 99.9% uptime, you'll use ~500-1000 errors/month (well within free tier)
- Performance events: ~3,000/month (also fine)

### Paid Tiers (if you grow):
- **Team Plan:** $26/mo for 50K errors + 100K performance events
- **Business Plan:** $80/mo for 500K errors + priority support

---

## Troubleshooting

### "Errors not showing up in Sentry"

1. Check DSN is set correctly:
   ```bash
   echo $VITE_SENTRY_DSN
   ```

2. Check environment is not `development`:
   ```bash
   echo $VITE_ENVIRONMENT
   ```

3. Check browser console for "✅ Sentry initialized" message

4. Try triggering a test error (see step 4 above)

### "Too many errors being reported"

Adjust sample rates in `src/lib/sentry.js`:

```js
// Reduce from 100% to 10%
tracesSampleRate: 0.1,

// Only capture 5% of normal sessions
replaysSessionSampleRate: 0.05,
```

### "Privacy concerns about session replay"

Session replays are:
- Only captured when errors occur (99% of sessions ignored)
- All text is masked by default
- All media (images, videos) blocked
- Can be disabled entirely by removing `new Sentry.Replay()` integration

---

## Best Practices

### DO:
✅ Check Sentry dashboard weekly  
✅ Fix high-frequency errors first  
✅ Add context to manual error captures  
✅ Set up Slack alerts for critical errors  
✅ Review performance tab for slow pages

### DON'T:
❌ Log sensitive data (passwords, API keys, credit cards)  
❌ Ignore errors (if it's happening to users, fix it!)  
❌ Over-sample performance (expensive, not useful at 100%)  
❌ Capture every single error (filter noise)

---

## Example Errors You'll Catch

**Real examples from production apps:**

1. **"Cannot read property 'id' of undefined"**
   - Where: Dashboard when loading leads
   - Fix: Add null check before accessing lead.id

2. **"Network request failed"**
   - Where: API call to Supabase
   - Fix: Add retry logic or better error messaging

3. **"Failed to fetch"**
   - Where: AI response generation
   - Fix: Handle Gemini API timeouts gracefully

4. **"Invalid or expired token"**
   - Where: User session expired during action
   - Fix: Auto-refresh token or redirect to login

---

## Status

✅ **Sentry configured and ready to use!**

To activate:
1. Sign up at https://sentry.io
2. Add DSN to `.env.local` and Vercel
3. Deploy and watch errors roll in (hopefully not many! 😄)

**Questions?** Check https://docs.sentry.io/platforms/javascript/guides/react/

---

**Pro tip:** Set up a Slack integration so your team gets notified immediately when critical errors occur. No more "users reported this yesterday but we didn't know!"
