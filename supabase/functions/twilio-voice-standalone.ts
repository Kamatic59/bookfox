// Twilio Voice Webhook Handler (Standalone version for Supabase Editor)
// Handles incoming calls and missed call detection

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// ============================================================================
// SUPABASE CLIENT
// ============================================================================
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================================
// TWILIO UTILITIES
// ============================================================================
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!;

async function sendSMS(to: string, from: string, body: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio error: ${error}`);
  }
  
  const data = await response.json();
  return { sid: data.sid, status: data.status };
}

function twiml(content: string): Response {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response>${content}</Response>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseTwilioBody(body: string): Record<string, string> {
  const params: Record<string, string> = {};
  for (const pair of body.split('&')) {
    const [key, value] = pair.split('=');
    if (key && value !== undefined) {
      params[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
    }
  }
  return params;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
serve(async (req) => {
  try {
    const body = await req.text();
    const params = parseTwilioBody(body);
    
    console.log('Voice webhook received:', params);
    
    const toPhone = params.To;
    const fromPhone = params.From;
    const callStatus = params.CallStatus;
    const callSid = params.CallSid;
    
    // Find the business by Twilio phone number
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('*')
      .eq('twilio_phone', toPhone)
      .single();
    
    if (bizError || !business) {
      console.error('Business not found for phone:', toPhone);
      return twiml(`<Say voice="Polly.Joanna">Sorry, this number is not currently active.</Say><Hangup/>`);
    }
    
    // Log the call
    await supabase.from('call_log').insert({
      business_id: business.id,
      from_phone: fromPhone,
      to_phone: toPhone,
      call_status: callStatus,
      twilio_sid: callSid,
    });
    
    // Handle different call statuses
    if (callStatus === 'ringing' || callStatus === 'in-progress') {
      return twiml(
        `<Say voice="Polly.Joanna">Thanks for calling ${escapeXml(business.name)}. We're currently unavailable. We'll text you right away to help!</Say><Hangup/>`
      );
    }
    
    // For missed/no-answer calls, trigger SMS follow-up
    if (['no-answer', 'busy', 'canceled', 'completed'].includes(callStatus)) {
      await handleMissedCall(business, fromPhone, callSid);
    }
    
    return twiml('<Hangup/>');
    
  } catch (error) {
    console.error('Voice webhook error:', error);
    return twiml(`<Say voice="Polly.Joanna">An error occurred. Please try again later.</Say><Hangup/>`);
  }
});

async function handleMissedCall(business: any, customerPhone: string, callSid: string) {
  console.log(`Handling missed call for ${business.name} from ${customerPhone}`);
  
  // Get AI settings
  const { data: aiSettings } = await supabase
    .from('ai_settings')
    .select('*')
    .eq('business_id', business.id)
    .single();
  
  if (!aiSettings?.auto_respond) {
    console.log('Auto-respond disabled for business');
    return;
  }
  
  // Check if we already have an active conversation
  const { data: existingConvo } = await supabase
    .from('conversations')
    .select('id')
    .eq('business_id', business.id)
    .eq('customer_phone', customerPhone)
    .eq('status', 'active')
    .single();
  
  if (existingConvo) {
    console.log('Active conversation already exists, skipping greeting');
    return;
  }
  
  // Create or find lead
  let { data: lead } = await supabase
    .from('leads')
    .select('id')
    .eq('business_id', business.id)
    .eq('phone', customerPhone)
    .single();
  
  if (!lead) {
    const { data: newLead, error: leadError } = await supabase
      .from('leads')
      .insert({
        business_id: business.id,
        phone: customerPhone,
        source: 'missed_call',
        status: 'new',
      })
      .select()
      .single();
    
    if (leadError) {
      console.error('Failed to create lead:', leadError);
      return;
    }
    lead = newLead;
  }
  
  // Create conversation
  const { data: conversation, error: convoError } = await supabase
    .from('conversations')
    .insert({
      business_id: business.id,
      lead_id: lead.id,
      business_phone: business.twilio_phone,
      customer_phone: customerPhone,
      status: 'active',
      mode: 'ai',
      ai_context: { collected_info: {} },
    })
    .select()
    .single();
  
  if (convoError) {
    console.error('Failed to create conversation:', convoError);
    return;
  }
  
  // Generate greeting
  const assistantName = aiSettings.assistant_name || 'BookFox';
  const greeting = `Hi! This is ${assistantName} from ${business.name}. I noticed we missed your call - how can I help you today? 🦊`;
  
  // Send SMS
  const { sid: twilioSid, status: twilioStatus } = await sendSMS(
    customerPhone,
    business.twilio_phone,
    greeting
  );
  
  // Log the message
  await supabase.from('messages').insert({
    conversation_id: conversation.id,
    direction: 'outbound',
    content: greeting,
    sender_type: 'ai',
    twilio_sid: twilioSid,
    twilio_status: twilioStatus,
  });
  
  // Update call log as processed
  await supabase
    .from('call_log')
    .update({ processed: true, lead_id: lead.id })
    .eq('twilio_sid', callSid);
  
  console.log(`Greeting sent to ${customerPhone}`);
}
