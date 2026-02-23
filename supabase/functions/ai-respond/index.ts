// AI Response Generator
// Internal function to generate AI responses (for testing and manual triggers)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { supabase } from '../_shared/supabase.ts';
import { generateResponse, generateGreeting } from '../_shared/gemini.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { conversationId, message, action } = await req.json();
    
    if (action === 'greeting') {
      // Generate a greeting for a business
      const { businessId } = await req.json();
      
      const { data: business } = await supabase
        .from('businesses')
        .select('name')
        .eq('id', businessId)
        .single();
      
      const { data: aiSettings } = await supabase
        .from('ai_settings')
        .select('assistant_name')
        .eq('business_id', businessId)
        .single();
      
      const greeting = await generateGreeting({
        businessName: business?.name || 'our company',
        assistantName: aiSettings?.assistant_name || 'BookFox',
      });
      
      return new Response(
        JSON.stringify({ greeting }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (action === 'respond') {
      // Generate a response for a conversation
      if (!conversationId || !message) {
        throw new Error('conversationId and message are required');
      }
      
      // Get conversation with business and AI settings
      const { data: conversation } = await supabase
        .from('conversations')
        .select(`
          *,
          business:businesses(*),
          lead:leads(*)
        `)
        .eq('id', conversationId)
        .single();
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      const { data: aiSettings } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('business_id', conversation.business_id)
        .single();
      
      // Get message history
      const { data: messages } = await supabase
        .from('messages')
        .select('direction, content, sender_type')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(20);
      
      const messageHistory = (messages || []).map(m => ({
        role: m.sender_type === 'customer' ? 'customer' as const : 'ai' as const,
        content: m.content,
      }));
      
      const context = {
        businessName: conversation.business.name,
        assistantName: aiSettings?.assistant_name || 'BookFox',
        servicesOffered: aiSettings?.services_offered || [],
        pricingNotes: aiSettings?.pricing_notes || null,
        qualificationQuestions: aiSettings?.qualification_questions || [],
        businessHours: conversation.business.business_hours || {},
        collectedInfo: conversation.ai_context?.collected_info || {},
        messageHistory,
      };
      
      const result = await generateResponse(message, context);
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    throw new Error('Invalid action. Use "greeting" or "respond"');
    
  } catch (error) {
    console.error('AI respond error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
