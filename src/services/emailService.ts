import emailjs from '@emailjs/browser';

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO SET UP (one-time, free):
// 1. Go to https://www.emailjs.com/ and sign up
// 2. Add a new Email Service → connect your Gmail (kuvanta.tech@gmail.com)
// 3. Create an Email Template with variables: {{subject}}, {{body}}, {{to_email}}
// 4. Copy your Public Key from Account → API Keys
// 5. Fill in the three constants below
// ─────────────────────────────────────────────────────────────────────────────

export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'JSbXAOl0nuhG21IB0',
  SERVICE_ID: 'service_foutoir',
  TEMPLATE_ID: 'template_bzc8ayb',
};

let initialised = false;

const init = () => {
  if (!initialised) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    initialised = true;
  }
};

export interface EmailPayload {
  toEmail: string;        // primary recipient
  ccEmail?: string;       // cc (customer)
  subject: string;
  body: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
  // If keys aren't configured yet, fall back to mailto silently
  if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    const a = document.createElement('a');
    a.href = `mailto:${payload.toEmail}${payload.ccEmail ? `?cc=${encodeURIComponent(payload.ccEmail)}` : ''}` +
             `&subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
    a.click();
    return true;
  }

  try {
    init();
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        to_email: payload.toEmail,
        cc_email: payload.ccEmail || '',
        subject: payload.subject,
        body: payload.body,
      }
    );
    return true;
  } catch (err) {
    console.error('EmailJS send failed:', err);
    // Graceful fallback
    const a = document.createElement('a');
    a.href = `mailto:${payload.toEmail}&subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
    a.click();
    return false;
  }
};
