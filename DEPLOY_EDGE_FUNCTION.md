# Deploy Edge Function to Fix Business Creation

The RLS issue has been fixed by creating an Edge Function that uses the service role to create businesses. You need to deploy this function to Supabase.

## Option 1: Deploy via Supabase CLI (Recommended)

1. Install Supabase CLI if you haven't:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Deploy the function:
   ```bash
   cd /path/to/bookfox
   supabase functions deploy create-business --project-ref cqdtshvggnmwuvgvpxrv
   ```

## Option 2: Deploy via Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/cqdtshvggnmwuvgvpxrv

2. Navigate to **Edge Functions** in the left sidebar

3. Click **New Function** or **Deploy a new function**

4. Name it: `create-business`

5. Copy the contents of `supabase/functions/create-business/index.ts` and paste it

6. Click Deploy

## After Deploying

1. The onboarding and signup flows will automatically use the Edge Function
2. Test by:
   - Signing out
   - Creating a new account
   - Going through onboarding

## What This Fixes

- The RLS policy was blocking direct inserts to the `businesses` table
- The Edge Function uses the service role key (which bypasses RLS)
- It validates the user's JWT first, so it's still secure
- It creates both the business AND the team_member link in one atomic operation

## Troubleshooting

If you still get errors:
1. Check Edge Function logs in Supabase Dashboard → Edge Functions → create-business → Logs
2. Make sure the function is deployed and showing as "Active"
3. Check that SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are available (they're auto-provided by Supabase)
