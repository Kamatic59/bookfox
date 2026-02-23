// Google Gemini AI integration for BookFox

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;
const GEMINI_MODEL = 'gemini-1.5-flash'; // Fast and cheap for SMS

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface ConversationContext {
  businessName: string;
  assistantName: string;
  servicesOffered: string[];
  pricingNotes: string | null;
  qualificationQuestions: Array<{ id: string; question: string; required: boolean }>;
  businessHours: Record<string, { start: string; end: string; enabled: boolean }>;
  collectedInfo: Record<string, string>;
  messageHistory: Array<{ role: 'customer' | 'ai'; content: string }>;
}

// Generate AI response for conversation
export async function generateResponse(
  customerMessage: string,
  context: ConversationContext
): Promise<{ response: string; intent: string; confidence: number; collectedInfo: Record<string, string> }> {
  
  const systemPrompt = buildSystemPrompt(context);
  const conversationHistory = buildConversationHistory(context.messageHistory);
  
  // Add the new customer message
  conversationHistory.push({
    role: 'user',
    parts: [{ text: customerMessage }],
  });
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200, // Keep SMS-friendly
          topP: 0.9,
        },
      }),
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Gemini API error:', error);
    throw new Error(`Gemini API error: ${response.status}`);
  }
  
  const data = await response.json();
  const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // Parse the structured response
  return parseAIResponse(aiText, context.collectedInfo);
}

function buildSystemPrompt(context: ConversationContext): string {
  const services = context.servicesOffered.length > 0 
    ? context.servicesOffered.join(', ')
    : 'general trade services';
    
  const pricing = context.pricingNotes 
    ? `Pricing info: ${context.pricingNotes}`
    : 'Do not discuss specific pricing - say the team will provide a quote.';
  
  const unanswered = context.qualificationQuestions
    .filter(q => !context.collectedInfo[q.id])
    .map(q => `- ${q.id}: "${q.question}"`)
    .join('\n');
  
  return `You are ${context.assistantName}, a friendly AI assistant for ${context.businessName}, a ${services} company.

Your job is to help potential customers via SMS:
1. Be warm, friendly, and professional (but not robotic)
2. Qualify leads by naturally gathering information
3. Offer to schedule appointments when appropriate
4. Keep responses SHORT - this is SMS, aim for 1-3 sentences max

INFORMATION TO GATHER (ask naturally, not all at once):
${unanswered || '(All required info collected!)'}

ALREADY COLLECTED:
${Object.entries(context.collectedInfo).map(([k, v]) => `- ${k}: ${v}`).join('\n') || '(Nothing yet)'}

${pricing}

RESPONSE FORMAT:
Always respond with valid JSON in this format:
{
  "response": "Your SMS response text here",
  "intent": "greeting|inquiry|scheduling|objection|information|offtopic|goodbye",
  "confidence": 0.95,
  "extracted": {"field_id": "value"} 
}

The "extracted" object should contain any new information learned from the customer's message. Use the field IDs: service, urgency, property, name, address, preferred_time.

If the customer seems ready to book, ask for their preferred day/time.
If they ask about pricing, offer to have someone call them with a quote.
If they go off-topic, gently redirect to how you can help with their service needs.
If they say goodbye or decline service, thank them warmly and let them know you're here if they change their mind.`;
}

function buildConversationHistory(history: Array<{ role: 'customer' | 'ai'; content: string }>): GeminiMessage[] {
  return history.map(msg => ({
    role: msg.role === 'customer' ? 'user' : 'model',
    parts: [{ text: msg.role === 'ai' ? `{"response": "${msg.content}"}` : msg.content }],
  }));
}

function parseAIResponse(
  aiText: string,
  existingInfo: Record<string, string>
): { response: string; intent: string; confidence: number; collectedInfo: Record<string, string> } {
  
  // Try to parse as JSON
  try {
    // Find JSON in the response (sometimes the model adds extra text)
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        response: parsed.response || aiText,
        intent: parsed.intent || 'inquiry',
        confidence: parsed.confidence || 0.8,
        collectedInfo: { ...existingInfo, ...(parsed.extracted || {}) },
      };
    }
  } catch (e) {
    console.warn('Failed to parse AI response as JSON:', e);
  }
  
  // Fallback: use raw text
  return {
    response: aiText.slice(0, 320), // SMS length limit
    intent: 'inquiry',
    confidence: 0.5,
    collectedInfo: existingInfo,
  };
}

// Generate initial greeting for missed call
export async function generateGreeting(
  context: Pick<ConversationContext, 'businessName' | 'assistantName'>
): Promise<string> {
  // Use template for consistency and speed (no API call needed)
  return `Hi! This is ${context.assistantName} from ${context.businessName}. I noticed we missed your call - how can I help you today? 🦊`;
}

// Check if conversation should escalate to human
export function shouldEscalate(
  messageCount: number,
  maxMessages: number,
  lastIntent: string,
  confidence: number
): { escalate: boolean; reason: string } {
  
  if (messageCount >= maxMessages) {
    return { escalate: true, reason: 'max_messages_reached' };
  }
  
  if (confidence < 0.4) {
    return { escalate: true, reason: 'low_confidence' };
  }
  
  if (lastIntent === 'objection' && confidence < 0.6) {
    return { escalate: true, reason: 'objection_handling' };
  }
  
  return { escalate: false, reason: '' };
}
