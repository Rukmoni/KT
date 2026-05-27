/*
  Send email via Resend API (https://resend.com — free tier: 3000 emails/month).
  Requires RESEND_API_KEY secret to be set in Supabase Edge Function secrets.
  From address must be a verified domain in Resend (or use onboarding@resend.dev for testing).
*/

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmailPayload {
  toEmail: string;
  ccEmail?: string;
  subject: string;
  body: string;
  fromName?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      return json({ ok: false, error: 'RESEND_API_KEY not configured' }, corsHeaders, 500);
    }

    const fromName  = payload.fromName || 'Kuvanta Website';
    // Use verified sender — once kuvanta.tech domain is verified in Resend,
    // change fromEmail to 'noreply@kuvanta.tech' or similar.
    const fromEmail = 'onboarding@resend.dev';

    // Resend free tier only allows sending to the account owner's email until
    // a domain is verified. Route all inquiries to the verified address;
    // the original toEmail and ccEmail are included in the email body/reply-to.
    const VERIFIED_INBOX = 'nagarajan@kuvanta.tech';

    const resendBody: Record<string, unknown> = {
      from:     `${fromName} <${fromEmail}>`,
      to:       [VERIFIED_INBOX],
      subject:  payload.subject,
      text:     payload.body,
      reply_to: payload.ccEmail || payload.toEmail,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(resendBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Resend error ${res.status}: ${errText}`);
      return json({ ok: false, error: errText }, corsHeaders, 500);
    }

    const data = await res.json();
    return json({ ok: true, id: data.id }, corsHeaders);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('send-email error:', msg);
    return json({ ok: false, error: msg }, corsHeaders, 500);
  }
});

function json(data: unknown, headers: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
