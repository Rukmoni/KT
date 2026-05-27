const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;

export interface EmailPayload {
  toEmail: string;
  ccEmail?: string;
  subject: string;
  body: string;
  fromName?: string;
}

// Used by ChatbotWidget and AdminLeads for programmatic (non-form) email sends.
export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
  try {
    const res = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      console.error('send-email failed:', err);
      return false;
    }

    return true;
  } catch (err) {
    console.error('send-email error:', err);
    return false;
  }
};

// Used by Contact.tsx form (native POST to formsubmit.co)
export function buildSubject(name: string, service: string): string {
  const now = new Date();
  const datetime = now.toLocaleString('en-MY', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  return `Enquiry from ${name} about ${service} on ${datetime}`;
}
