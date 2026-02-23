# BookFox 🦊

AI-powered receptionist for trade businesses. Smart. Quick. Never misses a lead.

**Catch missed calls → AI qualifies via SMS → Auto-book appointments**

## Features

- 📞 **Missed Call Capture** — Instantly responds when customers can't reach you
- 🤖 **AI Lead Qualification** — Gemini-powered conversations that feel human
- 📅 **Auto-Booking** — AI schedules appointments based on your availability
- 💬 **Human Takeover** — Jump in anytime with full conversation history
- 📊 **Dashboard** — Real-time stats and lead management

## Tech Stack

- **Frontend:** React 18, Tailwind CSS 4, Vite
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **AI:** Google Gemini 1.5 Flash
- **Telephony:** Twilio (Voice + SMS)

---

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd bookfox
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration to set up the database:
   ```bash
   # Option A: Via Supabase CLI
   supabase db push
   
   # Option B: Copy/paste SQL manually
   # Go to Supabase Dashboard > SQL Editor
   # Paste contents of supabase/migrations/001_initial_schema.sql
   ```
3. Copy your API keys from Settings > API

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Deploy Edge Functions

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-id

# Set secrets (required for Twilio + Gemini)
supabase secrets set TWILIO_ACCOUNT_SID=ACxxx
supabase secrets set TWILIO_AUTH_TOKEN=xxx
supabase secrets set GEMINI_API_KEY=xxx

# Deploy functions
supabase functions deploy twilio-voice
supabase functions deploy twilio-sms
supabase functions deploy ai-respond
```

### 5. Configure Twilio

1. Get a phone number from [Twilio Console](https://console.twilio.com)
2. Set webhook URLs for the number:
   - **Voice:** `https://your-project.supabase.co/functions/v1/twilio-voice`
   - **SMS:** `https://your-project.supabase.co/functions/v1/twilio-sms`

### 6. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## Project Structure

```
bookfox/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── StatCard.jsx
│   │   ├── LeadCard.jsx
│   │   ├── ConversationList.jsx
│   │   └── ChatView.jsx
│   ├── context/         # React context providers
│   │   └── AuthContext.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useLeads.js
│   │   └── useConversations.js
│   ├── layouts/         # Layout wrappers
│   │   └── DashboardLayout.jsx
│   ├── lib/             # Utilities
│   │   └── supabase.js
│   ├── pages/           # Route pages
│   │   ├── Dashboard.jsx
│   │   ├── Inbox.jsx
│   │   ├── Calendar.jsx
│   │   ├── Leads.jsx
│   │   ├── Settings.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Onboarding.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   ├── migrations/      # Database schema
│   │   └── 001_initial_schema.sql
│   ├── functions/       # Edge Functions
│   │   ├── _shared/     # Shared utilities
│   │   ├── twilio-voice/
│   │   ├── twilio-sms/
│   │   └── ai-respond/
│   └── config.toml
├── .env.example
├── package.json
└── vite.config.js
```

---

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `businesses` | Business accounts (name, phone, hours, subscription) |
| `team_members` | Users linked to businesses (auth, roles) |
| `leads` | Potential customers (contact, status, qualification) |
| `conversations` | SMS threads (AI context, mode) |
| `messages` | Individual messages (content, direction, AI metadata) |
| `appointments` | Booked appointments |
| `ai_settings` | Per-business AI configuration |
| `call_log` | Incoming call records |

All tables have Row Level Security (RLS) — users only see their own business data.

---

## How It Works

### Call Flow

1. Customer calls → goes to voicemail or no-answer
2. Twilio hits `twilio-voice` webhook
3. BookFox creates lead + sends SMS greeting
4. Customer replies → `twilio-sms` webhook
5. Gemini AI qualifies lead (service needed, urgency, etc.)
6. AI offers to book appointment or escalates to human
7. Dashboard shows real-time conversation

### AI Conversation

- Uses **Gemini 1.5 Flash** for fast, cheap responses
- Structured prompts ensure consistent qualification
- Automatically extracts: service needed, urgency, property type, preferred time
- Escalates to human after N messages or low confidence

---

## Configuration

### Business Hours

Set in onboarding or Settings. The AI references these when booking.

### AI Settings

- **Assistant Name** — What the AI calls itself
- **Greeting Template** — First message after missed call
- **Services Offered** — Helps AI understand your business
- **Qualification Questions** — Customizable lead qual flow
- **Max Messages** — When to escalate to human

### Twilio Setup

1. Buy a local number in your area code
2. Configure webhooks (see above)
3. Set up call forwarding from your main business line

---

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Edge Functions Locally

```bash
# Start Supabase locally
supabase start

# Serve functions locally
supabase functions serve
```

---

## Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy `dist/` folder
```

### Edge Functions

```bash
supabase functions deploy --all
```

---

## Environment Variables

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

### Edge Functions (Supabase Secrets)

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `GEMINI_API_KEY` | Google AI Studio API key |

---

## Roadmap

- [ ] Email notifications for new leads
- [ ] SMS appointment reminders
- [ ] Calendar sync (Google Calendar)
- [ ] Multi-location support
- [ ] Advanced analytics
- [ ] Voice call transcription
- [ ] WhatsApp integration

---

Built with 🦊 by Kael + Patch
