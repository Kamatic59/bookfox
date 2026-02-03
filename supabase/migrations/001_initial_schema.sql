-- BookFox Database Schema
-- AI-powered receptionist for trade businesses

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- BUSINESSES
-- ============================================================================
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE, -- for potential subdomain/URL
  phone TEXT, -- main business phone
  email TEXT,
  website TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  
  -- Business details
  trade_type TEXT, -- plumber, hvac, electrician, etc.
  timezone TEXT DEFAULT 'America/Denver',
  
  -- Twilio
  twilio_phone TEXT, -- BookFox number for this business
  
  -- Subscription
  subscription_status TEXT DEFAULT 'trial', -- trial, active, past_due, canceled
  subscription_tier TEXT DEFAULT 'starter', -- starter, pro, enterprise
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  
  -- Settings
  business_hours JSONB DEFAULT '{
    "monday": {"start": "08:00", "end": "17:00", "enabled": true},
    "tuesday": {"start": "08:00", "end": "17:00", "enabled": true},
    "wednesday": {"start": "08:00", "end": "17:00", "enabled": true},
    "thursday": {"start": "08:00", "end": "17:00", "enabled": true},
    "friday": {"start": "08:00", "end": "17:00", "enabled": true},
    "saturday": {"start": "09:00", "end": "14:00", "enabled": false},
    "sunday": {"start": null, "end": null, "enabled": false}
  }'::JSONB
);

-- ============================================================================
-- TEAM MEMBERS (links auth.users to businesses)
-- ============================================================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  
  role TEXT DEFAULT 'member', -- owner, admin, member
  name TEXT,
  phone TEXT,
  
  -- Notifications
  notify_new_lead BOOLEAN DEFAULT TRUE,
  notify_appointment BOOLEAN DEFAULT TRUE,
  notify_urgent BOOLEAN DEFAULT TRUE,
  
  UNIQUE(user_id, business_id)
);

-- ============================================================================
-- LEADS (potential customers)
-- ============================================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Contact info
  phone TEXT NOT NULL,
  name TEXT,
  email TEXT,
  
  -- Lead details
  status TEXT DEFAULT 'new', -- new, contacted, qualified, appointment_set, converted, lost
  source TEXT DEFAULT 'missed_call', -- missed_call, website, referral, manual
  
  -- Qualification data (filled by AI)
  service_needed TEXT, -- "water heater replacement", "AC not cooling", etc.
  urgency TEXT, -- low, medium, high, emergency
  property_type TEXT, -- residential, commercial
  notes TEXT,
  
  -- AI scoring
  qualification_score INTEGER, -- 0-100
  
  -- Assignment
  assigned_to UUID REFERENCES team_members(id),
  
  -- Tracking
  first_contact_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- Index for quick lookups
CREATE INDEX idx_leads_business_id ON leads(business_id);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_status ON leads(status);

-- ============================================================================
-- CONVERSATIONS (SMS threads)
-- ============================================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Phone numbers
  business_phone TEXT NOT NULL, -- Twilio number
  customer_phone TEXT NOT NULL,
  
  -- State
  status TEXT DEFAULT 'active', -- active, paused, closed
  mode TEXT DEFAULT 'ai', -- ai, human, hybrid
  
  -- AI context
  ai_context JSONB DEFAULT '{}'::JSONB, -- conversation state for AI
  
  -- Stats
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ
);

CREATE INDEX idx_conversations_business_id ON conversations(business_id);
CREATE INDEX idx_conversations_customer_phone ON conversations(customer_phone);

-- ============================================================================
-- MESSAGES (individual SMS messages)
-- ============================================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Message details
  direction TEXT NOT NULL, -- inbound, outbound
  content TEXT NOT NULL,
  
  -- Sender info
  sender_type TEXT NOT NULL, -- customer, ai, human
  sender_id UUID, -- team_member id if human
  
  -- Twilio tracking
  twilio_sid TEXT,
  twilio_status TEXT, -- queued, sent, delivered, failed, etc.
  
  -- AI metadata
  ai_intent TEXT, -- detected intent
  ai_confidence REAL -- 0.0-1.0
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================================================
-- APPOINTMENTS
-- ============================================================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  
  -- Details
  service_type TEXT,
  notes TEXT,
  address TEXT,
  
  -- Status
  status TEXT DEFAULT 'scheduled', -- scheduled, confirmed, completed, canceled, no_show
  
  -- Assignment
  assigned_to UUID REFERENCES team_members(id),
  
  -- Reminders
  reminder_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ
);

CREATE INDEX idx_appointments_business_id ON appointments(business_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);

-- ============================================================================
-- AI SETTINGS (per-business AI configuration)
-- ============================================================================
CREATE TABLE ai_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Personality
  assistant_name TEXT DEFAULT 'BookFox',
  greeting_template TEXT DEFAULT 'Hi! This is {{assistant_name}} from {{business_name}}. I noticed we missed your call. How can I help you today?',
  
  -- Behavior
  auto_respond BOOLEAN DEFAULT TRUE,
  response_delay_seconds INTEGER DEFAULT 30, -- wait before responding to missed call
  max_messages_before_human INTEGER DEFAULT 10, -- escalate after N messages
  
  -- Qualification questions (customizable)
  qualification_questions JSONB DEFAULT '[
    {"id": "service", "question": "What service do you need help with?", "required": true},
    {"id": "urgency", "question": "How urgent is this? Is it an emergency?", "required": true},
    {"id": "property", "question": "Is this for a home or business?", "required": false}
  ]'::JSONB,
  
  -- Services offered (for AI context)
  services_offered JSONB DEFAULT '[]'::JSONB,
  
  -- Pricing hints (for AI to reference)
  pricing_notes TEXT,
  
  -- Availability rules
  booking_lead_time_hours INTEGER DEFAULT 24,
  booking_window_days INTEGER DEFAULT 14
);

-- ============================================================================
-- CALL LOG (for tracking missed calls from Twilio)
-- ============================================================================
CREATE TABLE call_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Call details
  from_phone TEXT NOT NULL,
  to_phone TEXT NOT NULL,
  call_status TEXT, -- no-answer, busy, canceled, completed
  call_duration INTEGER, -- seconds
  
  -- Twilio
  twilio_sid TEXT,
  
  -- Processing
  processed BOOLEAN DEFAULT FALSE,
  lead_id UUID REFERENCES leads(id)
);

CREATE INDEX idx_call_log_business_id ON call_log(business_id);
CREATE INDEX idx_call_log_from_phone ON call_log(from_phone);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_log ENABLE ROW LEVEL SECURITY;

-- Helper function: get business IDs for current user
CREATE OR REPLACE FUNCTION get_user_business_ids()
RETURNS SETOF UUID AS $$
  SELECT business_id FROM team_members WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- BUSINESSES: users can only see businesses they're members of
CREATE POLICY "Users can view their businesses"
  ON businesses FOR SELECT
  USING (id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can update their businesses"
  ON businesses FOR UPDATE
  USING (id IN (SELECT get_user_business_ids()));

-- TEAM_MEMBERS: users can see team members in their businesses
CREATE POLICY "Users can view team members in their businesses"
  ON team_members FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Owners can manage team members"
  ON team_members FOR ALL
  USING (
    business_id IN (
      SELECT business_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- LEADS: users can see leads for their businesses
CREATE POLICY "Users can view leads for their businesses"
  ON leads FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can manage leads for their businesses"
  ON leads FOR ALL
  USING (business_id IN (SELECT get_user_business_ids()));

-- CONVERSATIONS: users can see conversations for their businesses
CREATE POLICY "Users can view conversations for their businesses"
  ON conversations FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can manage conversations for their businesses"
  ON conversations FOR ALL
  USING (business_id IN (SELECT get_user_business_ids()));

-- MESSAGES: users can see messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE business_id IN (SELECT get_user_business_ids())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE business_id IN (SELECT get_user_business_ids())
    )
  );

-- APPOINTMENTS: users can see appointments for their businesses
CREATE POLICY "Users can view appointments for their businesses"
  ON appointments FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can manage appointments for their businesses"
  ON appointments FOR ALL
  USING (business_id IN (SELECT get_user_business_ids()));

-- AI_SETTINGS: users can see AI settings for their businesses
CREATE POLICY "Users can view AI settings for their businesses"
  ON ai_settings FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can manage AI settings for their businesses"
  ON ai_settings FOR ALL
  USING (business_id IN (SELECT get_user_business_ids()));

-- CALL_LOG: users can see call logs for their businesses
CREATE POLICY "Users can view call logs for their businesses"
  ON call_log FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

-- ============================================================================
-- SERVICE ROLE POLICIES (for Edge Functions)
-- These allow the service role to bypass RLS for webhook processing
-- ============================================================================

-- Note: Service role bypasses RLS by default, but we'll create explicit
-- policies for documentation purposes

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ai_settings_updated_at
  BEFORE UPDATE ON ai_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create AI settings when business is created
CREATE OR REPLACE FUNCTION create_default_ai_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ai_settings (business_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_ai_settings_for_new_business
  AFTER INSERT ON businesses
  FOR EACH ROW EXECUTE FUNCTION create_default_ai_settings();

-- Update conversation message count and last_message_at
CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET 
    message_count = message_count + 1,
    last_message_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_stats();

-- Update lead contact timestamps
CREATE OR REPLACE FUNCTION update_lead_contact_times()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE leads 
  SET 
    first_contact_at = COALESCE(first_contact_at, NEW.created_at),
    last_contact_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = (
    SELECT lead_id FROM conversations WHERE id = NEW.conversation_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_lead_contact_times();

-- Performance indexes can be added later if needed
