# BookFox Deployment Guide

## Prerequisites

- [ ] Supabase project created
- [ ] Twilio account with phone number
- [ ] Google Gemini API key
- [ ] Vercel account (for frontend)
- [ ] Domain name (optional)

---

## 1. Database Setup

### Apply Migrations
```bash
# From your Supabase dashboard → SQL Editor, run in order:
1. supabase/migrations/001_initial_schema.sql
2. supabase/migrations/20260204_fix_rls_insert.sql
3. supabase/migrations/20260211_performance_indexes.sql
```

### Verify Tables
Check that these tables exist:
- `businesses`
- `team_members`
- `leads`
- `conversations`
- `messages`
- `appointments`
- `ai_settings`
- `call_log`

---

## 2. Edge Functions Deployment

### Set Environment Variables in Supabase
Go to: **Dashboard → Edge Functions → Secrets**

Add these secrets:
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Deploy Functions
```bash
# Install Supabase CLI if not already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy create-business
supabase functions deploy twilio-voice
supabase functions deploy twilio-sms

# Or deploy all at once:
supabase functions deploy
```

### Test Edge Functions
```bash
# Test create-business (requires auth token)
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/create-business' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name": "Test Business", "trade_type": "plumbing"}'

# Should return:
# {"business": {"id": "...", "name": "Test Business", ...}}
```

---

## 3. Twilio Configuration

### Configure Webhooks
Go to: **Twilio Console → Phone Numbers → Manage → Active Numbers → [Your Number]**

Set these webhooks:

**Voice Configuration:**
- When a call comes in: `Webhook`
- URL: `https://YOUR_PROJECT.supabase.co/functions/v1/twilio-voice`
- HTTP Method: `POST`

**Messaging Configuration:**
- When a message comes in: `Webhook`
- URL: `https://YOUR_PROJECT.supabase.co/functions/v1/twilio-sms`
- HTTP Method: `POST`

### Test Twilio Integration
1. Call your Twilio number → Should play voicemail message
2. Wait 30 seconds → Should receive SMS greeting
3. Reply to SMS → Should get AI response

---

## 4. Frontend Deployment (Vercel)

### Environment Variables
In Vercel dashboard, add:
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_APP_URL=https://your-domain.vercel.app
```

### Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Or connect your GitHub repo for automatic deployments
```

### Verify Deployment
1. Visit your app URL
2. Sign up for a new account
3. Complete onboarding
4. Check that dashboard loads with your business

---

## 5. Post-Deployment Checks

### Database
- [ ] Can create new user account
- [ ] Business is created on signup
- [ ] Team member link is created
- [ ] AI settings auto-created

### Edge Functions
- [ ] Create-business works
- [ ] Twilio voice webhook responds
- [ ] Twilio SMS webhook responds
- [ ] Signature validation working

### Twilio Integration
- [ ] Missed call triggers SMS
- [ ] SMS conversation works
- [ ] AI responses generate
- [ ] Conversation saves to database

### Security
- [ ] RLS policies enforce data isolation
- [ ] Twilio signature validation enabled
- [ ] No service role key in frontend code
- [ ] Environment variables not committed

---

## 6. Monitoring Setup

### Supabase Dashboard
Monitor these:
- **Database → Table Editor**: Check data is being created
- **Database → Logs**: Watch for errors
- **Edge Functions → Logs**: Monitor webhook calls

### Set Up Alerts
1. Supabase → Settings → Integrations
2. Add webhook for critical errors
3. Connect to Slack/Discord/Email

---

## 7. Production Checklist

### Pre-Launch
- [ ] All migrations applied
- [ ] Edge Functions deployed
- [ ] Environment variables set
- [ ] Twilio webhooks configured
- [ ] Frontend deployed
- [ ] End-to-end test passed
- [ ] RLS policies tested with multiple users
- [ ] Error monitoring configured

### Security
- [ ] Service role key not in git
- [ ] Twilio signature validation enabled
- [ ] CORS configured for production domain only
- [ ] Rate limiting implemented (optional)

### Performance
- [ ] Performance indexes added
- [ ] Database connection pooling configured
- [ ] CDN configured for static assets

### Legal/Compliance
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] GDPR compliance reviewed
- [ ] Data retention policy documented

---

## 8. Common Issues & Solutions

### Edge Function Returns 500
**Check:**
1. Environment variables set in Supabase Secrets
2. Function logs: `supabase functions logs twilio-voice`
3. Syntax errors in TypeScript

### Twilio Webhook Not Working
**Check:**
1. Webhook URL is correct (no trailing slash)
2. HTTP method is POST
3. Signature validation not rejecting requests
4. Check Edge Function logs

### Database Permission Error
**Check:**
1. RLS policies allow the operation
2. User is member of a business (team_members table)
3. Service role key used in Edge Functions

### AI Not Responding
**Check:**
1. GEMINI_API_KEY is valid
2. API key has quota remaining
3. Check Edge Function logs for Gemini errors

---

## 9. Rollback Plan

If something breaks:

### Rollback Edge Functions
```bash
# List deployments
supabase functions list

# Rollback to previous version
supabase functions deploy function-name --version VERSION_ID
```

### Rollback Database
```bash
# Restore from backup (if enabled)
# Go to Supabase Dashboard → Database → Backups
```

### Rollback Frontend
```bash
# In Vercel dashboard:
# Deployments → Previous Deployment → Promote to Production
```

---

## 10. Scaling Considerations

### When You Hit Limits

**Database:**
- Upgrade Supabase plan
- Add read replicas
- Optimize slow queries

**Edge Functions:**
- They auto-scale!
- But watch for timeout issues (10s limit)
- Consider moving long operations to background jobs

**Twilio:**
- Request higher rate limits
- Use Twilio messaging service for better deliverability

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Twilio Docs:** https://www.twilio.com/docs
- **Gemini API Docs:** https://ai.google.dev/docs
- **BookFox Issues:** GitHub Issues tab

---

## Success Metrics

Track these after launch:
- Missed calls captured
- SMS conversations initiated
- Leads qualified by AI
- Appointments booked
- Conversation escalation rate
- AI response quality

Monitor these for 48 hours post-launch, then weekly.
