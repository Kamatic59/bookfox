// Twilio utilities for Edge Functions

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!;

// Send an SMS via Twilio
export async function sendSMS(to: string, from: string, body: string): Promise<{ sid: string; status: string }> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: to,
      From: from,
      Body: body,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio error: ${error}`);
  }
  
  const data = await response.json();
  return { sid: data.sid, status: data.status };
}

// Validate Twilio webhook signature
export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  // TODO: Implement proper signature validation
  // For now, we'll trust requests (add validation before production!)
  // See: https://www.twilio.com/docs/usage/security#validating-requests
  
  if (!signature) {
    console.warn('No Twilio signature provided - skipping validation');
    return true; // Allow for development
  }
  
  // In production, implement HMAC-SHA1 validation here
  return true;
}

// Generate TwiML response
export function twiml(content: string): Response {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response>${content}</Response>`,
    {
      headers: { 'Content-Type': 'application/xml' },
    }
  );
}

// TwiML builders
export const TwiML = {
  say: (text: string, voice = 'Polly.Joanna') => 
    `<Say voice="${voice}">${escapeXml(text)}</Say>`,
  
  hangup: () => '<Hangup/>',
  
  reject: (reason: 'busy' | 'rejected' = 'busy') => 
    `<Reject reason="${reason}"/>`,
  
  sms: (text: string, to?: string, from?: string) => {
    const attrs = [
      to ? `to="${to}"` : '',
      from ? `from="${from}"` : '',
    ].filter(Boolean).join(' ');
    return `<Message ${attrs}>${escapeXml(text)}</Message>`;
  },
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Parse form-urlencoded body from Twilio webhook
export function parseTwilioBody(body: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pairs = body.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value !== undefined) {
      params[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
    }
  }
  
  return params;
}
