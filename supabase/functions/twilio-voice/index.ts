// Twilio Voice Webhook Handler
// Handles incoming calls and missed call detection

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { supabase, type Business } from '../_shared/supabase.ts';
import { parseTwilioBody, twiml, TwiML, sendSMS } from '../_shared/twilio.ts';
import { generateGreeting } from '../_shared/gemini.ts';

serve(async (req) => {
  try {
    const body = await req.text();
    const params = parseTwilioBody(body);
    
    console.log('Voice webhook received:', params);
    
    const toPhone = params.To; // Our Twilio number
    const fromPhone = params.From; // Caller's phone
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
      // Still answer gracefully
      return twiml(TwiML.say('Sorry, this number is not currently active.') + TwiML.hangup());
    }
    
    // Log the call
    await supabase.from('call_log').insert({
      business_id: business.id,
      from_phone: fromPhone,
      to_phone: toPhone,
      call_status: callStatus,
      twilio_sid: callSid,
    });
    
    // Handle incoming calls - play message and send SMS follow-up
    if (callStatus === 'ringing' || callStatus === 'in-progress') {
      // Trigger SMS follow-up immediately (don't await - let it run in background)
      handleMissedCall(business, fromPhone, callSid).catch(err => 
        console.error('SMS follow-up error:', err)
      );
      
      // Play the voicemail message
      return twiml(
        TwiML.say(`Thanks for calling ${business.name}. We're currently unavailable. We'll text you right away to help!`) +
        TwiML.hangup()
      );
    }
    
    // For status callbacks (if configured), also handle
    if (['no-answer', 'busy', 'canceled', 'completed'].includes(callStatus)) {
      await handleMissedCall(business, fromPhone, callSid);
    }
    
    return twiml(TwiML.hangup());
    
  } catch (error) {
    console.error('Voice webhook error:', error);
    return twiml(TwiML.say('An error occurred. Please try again later.') + TwiML.hangup());
  }
});

async function handleMissedCall(business: Business, customerPhone: string, callSid: string) {
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
  
  // Check if we already have a conversation with this customer
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
  
  // Generate and send greeting
  const greeting = await generateGreeting({
    businessName: business.name,
    assistantName: aiSettings.assistant_name || 'BookFox',
  });
  
  // Wait before sending (configurable delay)
  const delay = (aiSettings.response_delay_seconds || 30) * 1000;
  await new Promise(resolve => setTimeout(resolve, Math.min(delay, 5000))); // Cap at 5s for edge function
  
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
