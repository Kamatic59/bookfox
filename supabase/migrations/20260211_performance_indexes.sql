-- Performance optimization indexes
-- Add these to speed up common queries

-- Messages: Conversations ordered by time (for chat history)
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created 
  ON messages(conversation_id, created_at DESC);

-- Leads: Filter by business and status (for dashboard stats)
CREATE INDEX IF NOT EXISTS idx_leads_business_status 
  ON leads(business_id, status);

-- Conversations: Recent conversations for a business
CREATE INDEX IF NOT EXISTS idx_conversations_updated 
  ON conversations(business_id, updated_at DESC);

-- Call log: Unprocessed calls for a business
CREATE INDEX IF NOT EXISTS idx_call_log_unprocessed 
  ON call_log(business_id, processed) 
  WHERE processed = false;

-- Appointments: Upcoming appointments for a business
CREATE INDEX IF NOT EXISTS idx_appointments_upcoming 
  ON appointments(business_id, scheduled_at) 
  WHERE status IN ('scheduled', 'confirmed');

-- Analyze tables to update query planner statistics
ANALYZE businesses;
ANALYZE team_members;
ANALYZE leads;
ANALYZE conversations;
ANALYZE messages;
ANALYZE appointments;
ANALYZE call_log;
