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
// See: https://www.twilio.com/docs/usage/security#validating-requests
export async function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): Promise<boolean> {
  if (!signature) {
    console.warn('No Twilio signature provided - REJECTING request');
    return false; // Production: reject unsigned requests
  }
  
  const authToken = TWILIO_AUTH_TOKEN;
  
  // Build the data string: URL + sorted params concatenated
  const sortedKeys = Object.keys(params).sort();
  let data = url;
  for (const key of sortedKeys) {
    data += key + params[key];
  }
  
  // Compute HMAC-SHA1 signature
  const encoder = new TextEncoder();
  const keyData = encoder.encode(authToken);
  const messageData = encoder.encode(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature_bytes = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  
  // Convert to base64
  const computedSignature = btoa(String.fromCharCode(...new Uint8Array(signature_bytes)));
  
  const isValid = signature === computedSignature;
  
  if (!isValid) {
    console.error('Twilio signature validation FAILED', {
      expected: signature,
      computed: computedSignature,
      url,
    });
  }
  
  return isValid;
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

// Sanitize customer input to prevent injection attacks
export function sanitizeInput(text: string): string {
  if (!text) return '';
  
  return text
    // Remove potential script tags
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Limit length (SMS is max 1600 chars)
    .slice(0, 1600)
    // Trim whitespace
    .trim();
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
