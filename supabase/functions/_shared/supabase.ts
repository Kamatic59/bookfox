// Shared Supabase client for Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Service role client - bypasses RLS for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Types
export interface Business {
  id: string;
  name: string;
  twilio_phone: string;
  timezone: string;
  business_hours: Record<string, { start: string; end: string; enabled: boolean }>;
}

export interface Lead {
  id: string;
  business_id: string;
  phone: string;
  name: string | null;
  status: string;
  service_needed: string | null;
  urgency: string | null;
}

export interface Conversation {
  id: string;
  business_id: string;
  lead_id: string;
  business_phone: string;
  customer_phone: string;
  status: string;
  mode: string;
  ai_context: Record<string, any>;
}

export interface Message {
  id: string;
  conversation_id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  sender_type: 'customer' | 'ai' | 'human';
}

export interface AISettings {
  assistant_name: string;
  greeting_template: string;
  auto_respond: boolean;
  response_delay_seconds: number;
  max_messages_before_human: number;
  qualification_questions: Array<{ id: string; question: string; required: boolean }>;
  services_offered: string[];
  pricing_notes: string | null;
}
