import emailjs from '@emailjs/browser';

export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'tCkT2UyuXoSh7W0ig',
  SERVICE_ID: 'service_agg3uz6',
  TEMPLATE_ID: 'template_314wner',
};

// All enquiries and chatbot leads go to this address.
// A Gmail filter on "KT_ENQUIRY:" forwards them to nagarajan@kuvanta.tech.
export const ENQUIRY_RECIPIENT = 'nagarajanm.13@gmail.com';

let initialised = false;

const init = () => {
  if (!initialised) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    initialised = true;
  }
};

export interface EmailPayload {
  toEmail: string;
  ccEmail?: string;
  subject: string;
  body: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
  if (
    EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
    EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
  ) {
    console.warn('EmailJS not fully configured — fill in PUBLIC_KEY and TEMPLATE_ID in emailService.ts');
    return false;
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
    return false;
  }
};
