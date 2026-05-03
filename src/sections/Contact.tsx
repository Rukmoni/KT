import { useState } from 'react';
import { Mail, CalendarDays } from 'lucide-react';
import { useLeadStore } from '../store/leadStore';
import { sendEmail, ENQUIRY_RECIPIENT } from '../services/emailService';
import './Contact.css';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  return (
    <section id="contact" className="py-32 contact-section">
      <div className="container mx-auto contact-layout">

        {/* Left Side: Text and Contact Info */}
        <div className="contact-left">
          <h2 className="mb-6 font-bold contact-heading" style={{ lineHeight: '1.1', letterSpacing: '-0.03em' }}>
            Ready to build <br />
            <span className="text-gradient">the future?</span>
          </h2>
          <p className="text-secondary mb-12" style={{ fontSize: '1.15rem', lineHeight: '1.6', maxWidth: '420px', fontFamily: 'var(--font-sans)' }}>
            Join the world's most innovative brands. Let's start architecting your digital ecosystem today.
          </p>

          <div className="contact-info-row">
            <div className="contact-detail">
              <span className="contact-label">EMAIL US</span>
              <div className="contact-info-item">
                <Mail size={18} style={{ color: '#a482ff' }} />
                letsdothis@kuvanta.tech
              </div>
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/nagarajan-kuvanta/30min' });
                }}
                className="contact-info-item contact-calendly-link"
                style={{ marginTop: '0.75rem', cursor: 'pointer', textDecoration: 'none' }}
              >
                <CalendarDays size={18} style={{ color: '#a482ff' }} />
                Schedule time with me
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="contact-right">
          <div className="contact-form-card">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>✓</div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Inquiry Sent!</h3>
                <p style={{ color: '#aaa', fontSize: '0.95rem' }}>We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: '24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#ccc', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get('name') as string;
                const email = formData.get('email') as string;
                const phone = formData.get('phone') as string;
                const service = formData.get('service') as string;
                const details = formData.get('details') as string;
                const today = new Date().toLocaleString();

                const summarySnippet = details.length > 120 ? details.substring(0, 120) + '...' : details;

                let requestBody = `Dear Kuvanta Tech Sales Support Team,\n\n`;
                requestBody += `Please find the details of a new business inquiry submitted via the web portal on ${today}.\n\n`;
                requestBody += `EXECUTIVE SUMMARY\n`;
                requestBody += `-------------------------------------------------------\n`;
                requestBody += `The client is requesting assistance with ${service}. They provided the following requirement: "${summarySnippet}".\n\n`;
                requestBody += `CLIENT CONTACT DETAILS\n`;
                requestBody += `-------------------------------------------------------\n`;
                requestBody += `Name:          ${name}\n`;
                requestBody += `Email:         ${email}\n`;
                requestBody += `Phone:         ${phone}\n`;
                requestBody += `Service Type:  ${service}\n`;
                requestBody += `Date/Time:     ${today}\n\n`;
                requestBody += `RECOMMENDED ACTION ITEMS\n`;
                requestBody += `-------------------------------------------------------\n`;
                requestBody += `1. Review the verbatim inquiry constraints.\n`;
                requestBody += `2. Contact ${name} within 24 hours to schedule a deep-dive consultation.\n\n`;
                requestBody += `VERBATIM INQUIRY DETAILS\n`;
                requestBody += `-------------------------------------------------------\n`;
                requestBody += `${details}\n`;

                setSending(true);
                await sendEmail({
                  toEmail: ENQUIRY_RECIPIENT,
                  ccEmail: email,
                  subject: `KT_ENQUIRY: New Inquiry - ${service} - ${name}`,
                  body: requestBody,
                });
                setSending(false);
                setSubmitted(true);

                useLeadStore.getState().addLead({
                  source: 'Contact Form',
                  name,
                  email,
                  phone,
                  serviceType: service,
                  summary: summarySnippet,
                  fullTranscript: requestBody,
                });
              }}>
                <div className="contact-form-row">
                  <div className="form-field">
                    <label className="contact-label">NAME</label>
                    <input type="text" name="name" className="contact-input" placeholder="John Doe" required />
                  </div>
                  <div className="form-field">
                    <label className="contact-label">EMAIL</label>
                    <input type="email" name="email" className="contact-input" placeholder="john@example.com" required />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="form-field">
                    <label className="contact-label">PHONE</label>
                    <input type="tel" name="phone" className="contact-input" placeholder="+1 234 567 8900" required />
                  </div>
                  <div className="form-field">
                    <label className="contact-label">TYPE OF SERVICE</label>
                    <select name="service" className="contact-input" required style={{ appearance: 'auto', backgroundColor: 'transparent' }}>
                      <option value="" disabled selected style={{ color: '#000' }}>Select a service...</option>
                      <option value="App Development" style={{ color: '#000' }}>App Development</option>
                      <option value="Web Portal Development" style={{ color: '#000' }}>Web Portal Development</option>
                      <option value="AI Automation" style={{ color: '#000' }}>AI Automation</option>
                      <option value="PM Advisory" style={{ color: '#000' }}>PM Advisory</option>
                      <option value="Consultation" style={{ color: '#000' }}>Consultation</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="contact-label">BRIEF DESCRIPTION OF SERVICE EXPECTED</label>
                  <textarea name="details" className="contact-input" rows={4} placeholder="Tell us about your requirements..." required></textarea>
                </div>

                <button type="submit" className="contact-submit-btn" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
