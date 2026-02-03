// Twilio SMS Webhook Handler
// Handles incoming SMS and AI conversation

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { supabase } from '../_shared/supabase.ts';
import { parseTwilioBody, twiml, TwiML, sendSMS } from '../_shared/twilio.ts';
import { generateResponse, shouldEscalate } from '../_shared/gemini.ts';

serve(async (req) => {
  try {
    const body = await req.text();
    const params = parseTwilioBody(body);
    
    console.log('SMS webhook received:', params);
    
    const toPhone = params.To; // Our Twilio number
    const fromPhone = params.From; // Customer's phone
    const messageBody = params.Body;
    const messageSid = params.MessageSid;
    
    // Find the business by Twilio phone number
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('*')
      .eq('twilio_phone', toPhone)
      .single();
    
    if (bizError || !business) {
      console.error('Business not found for phone:', toPhone);
      return twiml(''); // Empty response
    }
    
    // Get AI settings
    const { data: aiSettings } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('business_id', business.id)
      .single();
    
    // Find or create conversation
    let { data: conversation } = await supabase
      .from('conversations')
      .select('*, lead:leads(*)')
      .eq('business_id', business.id)
      .eq('customer_phone', fromPhone)
      .eq('status', 'active')
      .single();
    
    if (!conversation) {
      // Create new lead and conversation
      const { data: lead } = await supabase
        .from('leads')
        .insert({
          business_id: business.id,
          phone: fromPhone,
          source: 'sms',
          status: 'new',
        })
        .select()
        .single();
      
      if (!lead) {
        console.error('Failed to create lead');
        return twiml('');
      }
      
      const { data: newConvo } = await supabase
        .from('conversations')
        .insert({
          business_id: business.id,
          lead_id: lead.id,
          business_phone: toPhone,
          customer_phone: fromPhone,
          status: 'active',
          mode: 'ai',
          ai_context: { collected_info: {} },
        })
        .select('*, lead:leads(*)')
        .single();
      
      conversation = newConvo;
    }
    
    if (!conversation) {
      console.error('Failed to get/create conversation');
      return twiml('');
    }
    
    // Store inbound message
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      direction: 'inbound',
      content: messageBody,
      sender_type: 'customer',
      twilio_sid: messageSid,
    });
    
    // If conversation is in human mode, don't auto-respond
    if (conversation.mode === 'human') {
      console.log('Conversation in human mode, skipping AI response');
      // TODO: Notify team member of new message
      return twiml('');
    }
    
    // Get message history for AI context
    const { data: messages } = await supabase
      .from('messages')
      .select('direction, content, sender_type')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(20);
    
    const messageHistory = (messages || []).map(m => ({
      role: m.sender_type === 'customer' ? 'customer' as const : 'ai' as const,
      content: m.content,
    }));
    
    // Build context for AI
    const context = {
      businessName: business.name,
      assistantName: aiSettings?.assistant_name || 'BookFox',
      servicesOffered: aiSettings?.services_offered || [],
      pricingNotes: aiSettings?.pricing_notes || null,
      qualificationQuestions: aiSettings?.qualification_questions || [],
      businessHours: business.business_hours || {},
      collectedInfo: conversation.ai_context?.collected_info || {},
      messageHistory: messageHistory.slice(0, -1), // Exclude the message we just added
    };
    
    // Generate AI response
    const aiResult = await generateResponse(messageBody, context);
    
    // Check if we should escalate to human
    const escalation = shouldEscalate(
      conversation.message_count + 1,
      aiSettings?.max_messages_before_human || 10,
      aiResult.intent,
      aiResult.confidence
    );
    
    if (escalation.escalate) {
      console.log(`Escalating conversation: ${escalation.reason}`);
      
      // Update conversation mode
      await supabase
        .from('conversations')
        .update({ mode: 'human' })
        .eq('id', conversation.id);
      
      // Send escalation message
      const escalationMsg = `Thanks for chatting! I'm going to connect you with a team member who can better help. They'll reach out shortly! 🦊`;
      
      const { sid, status } = await sendSMS(fromPhone, toPhone, escalationMsg);
      
      await supabase.from('messages').insert({
        conversation_id: conversation.id,
        direction: 'outbound',
        content: escalationMsg,
        sender_type: 'ai',
        twilio_sid: sid,
        twilio_status: status,
        ai_intent: 'escalation',
      });
      
      // TODO: Notify team via push/email
      
      return twiml('');
    }
    
    // Send AI response
    const { sid: twilioSid, status: twilioStatus } = await sendSMS(
      fromPhone,
      toPhone,
      aiResult.response
    );
    
    // Store outbound message
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      direction: 'outbound',
      content: aiResult.response,
      sender_type: 'ai',
      twilio_sid: twilioSid,
      twilio_status: twilioStatus,
      ai_intent: aiResult.intent,
      ai_confidence: aiResult.confidence,
    });
    
    // Update conversation context with collected info
    await supabase
      .from('conversations')
      .update({
        ai_context: {
          ...conversation.ai_context,
          collected_info: aiResult.collectedInfo,
          last_intent: aiResult.intent,
        },
      })
      .eq('id', conversation.id);
    
    // Update lead with any new qualification data
    const leadUpdates: Record<string, string> = {};
    if (aiResult.collectedInfo.service) leadUpdates.service_needed = aiResult.collectedInfo.service;
    if (aiResult.collectedInfo.urgency) leadUpdates.urgency = aiResult.collectedInfo.urgency;
    if (aiResult.collectedInfo.property) leadUpdates.property_type = aiResult.collectedInfo.property;
    if (aiResult.collectedInfo.name) leadUpdates.name = aiResult.collectedInfo.name;
    
    if (Object.keys(leadUpdates).length > 0) {
      await supabase
        .from('leads')
        .update(leadUpdates)
        .eq('id', conversation.lead_id);
    }
    
    console.log(`AI response sent to ${fromPhone}: "${aiResult.response.slice(0, 50)}..."`);
    
    return twiml(''); // Empty TwiML - we sent via API
    
  } catch (error) {
    console.error('SMS webhook error:', error);
    return twiml('');
  }
});
