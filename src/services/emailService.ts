const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;

export interface EmailPayload {
  toEmail: string;
  ccEmail?: string;
  subject: string;
  body: string;
  fromName?: string;
}

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
      openMailto(payload);
      return false;
    }

    return true;
  } catch (err) {
    console.error('send-email error:', err);
    openMailto(payload);
    return false;
  }
};

function openMailto(payload: EmailPayload) {
  const a = document.createElement('a');
  a.href =
    `mailto:${payload.toEmail}` +
    `?subject=${encodeURIComponent(payload.subject)}` +
    `&body=${encodeURIComponent(payload.body)}`;
  a.click();
}
