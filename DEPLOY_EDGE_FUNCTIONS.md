# 🚀 Deploy Edge Functions to Supabase

Your onboarding is failing because the `create-business` Edge Function isn't deployed properly or is missing environment variables.

## Quick Fix (5 minutes)

### 1. Install Supabase CLI (if not already installed)

```bash
# Mac/Linux
brew install supabase/tap/supabase

# Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### 2. Login to Supabase

```bash
supabase login
```

This will open a browser window - approve the login.

### 3. Link to Your Project

```bash
cd /path/to/bookfox
supabase link --project-ref cqdtshvggnmwuvgvpxrv
```

When prompted, enter your database password (the one you set when creating the Supabase project).

### 4. Set Environment Variables (CRITICAL!)

The Edge Functions need these secrets set in Supabase:

```bash
# Get these from: https://app.supabase.com/project/cqdtshvggnmwuvgvpxrv/settings/api

# Set SUPABASE_SERVICE_ROLE_KEY (the secret one, not anon!)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# The function also needs these (they're auto-injected by Supabase):
# - SUPABASE_URL (auto-set)
# - SUPABASE_ANON_KEY (auto-set)
```

**Where to find your keys:**
1. Go to https://app.supabase.com/project/cqdtshvggnmwuvgvpxrv/settings/api
2. Copy the **service_role** key (NOT the anon key)
3. Run the command above with your actual key

### 5. Deploy the Functions

```bash
supabase functions deploy create-business
supabase functions deploy twilio-voice
supabase functions deploy twilio-sms
```

Or deploy all at once:
```bash
supabase functions deploy
```

### 6. Test the Fix

1. Go back to your app: https://bookfox-ochre.vercel.app/
2. Try completing onboarding again
3. Should work now!

---

## What Was Wrong?

The error you saw was:
```
Failed to fetch at 'https://cqdtshvggnmwuvgvpxrv.supabase.co/functions/v1/create-business'
CORS policy error (500 status)
```

This means:
1. ❌ Either the Edge Function wasn't deployed
2. ❌ OR the `SUPABASE_SERVICE_ROLE_KEY` environment variable wasn't set
3. ❌ So the function crashed before it could return proper CORS headers

After following the steps above, it should work!

---

## Alternative: Deploy Via Supabase Dashboard

If you don't want to use CLI:

1. Go to https://app.supabase.com/project/cqdtshvggnmwuvgvpxrv/functions
2. Click "Deploy a new function"
3. Upload the files from `supabase/functions/create-business/`
4. Go to "Secrets" tab
5. Add `SUPABASE_SERVICE_ROLE_KEY` with your service role key

**But CLI is easier and faster!**

---

## Verification

After deploying, check:

1. Functions deployed:
   ```bash
   supabase functions list
   ```
   Should show: `create-business`, `twilio-voice`, `twilio-sms`

2. Secrets set:
   ```bash
   supabase secrets list
   ```
   Should show: `SUPABASE_SERVICE_ROLE_KEY`

3. Function logs (to debug if still failing):
   ```bash
   supabase functions logs create-business --follow
   ```

---

Need help? The error logs will be much clearer after deploying this fix!
