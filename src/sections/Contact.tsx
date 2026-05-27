import { useRef } from 'react';
import { Mail, CalendarDays } from 'lucide-react';
import { useLeadStore } from '../store/leadStore';
import { buildSubject } from '../services/emailService';
import './Contact.css';

export const Contact = () => {
  const subjectRef = useRef<HTMLInputElement>(null);
  const ccRef      = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form     = e.currentTarget;
    const name     = (form.elements.namedItem('name')    as HTMLInputElement).value;
    const email    = (form.elements.namedItem('email')   as HTMLInputElement).value;
    const phone    = (form.elements.namedItem('phone')   as HTMLInputElement).value;
    const service  = (form.elements.namedItem('service') as HTMLSelectElement).value;
    const details  = (form.elements.namedItem('details') as HTMLTextAreaElement).value;

    // Set dynamic hidden fields (same pattern as tested HTML)
    if (subjectRef.current) subjectRef.current.value = buildSubject(name, service);
    if (ccRef.current)      ccRef.current.value      = email;

    // Save lead to store before navigation
    const today         = new Date().toLocaleString();
    const summarySnippet = details.length > 120 ? details.substring(0, 120) + '...' : details;
    useLeadStore.getState().addLead({
      source: 'Contact Form',
      name,
      email,
      phone,
      serviceType: service,
      summary: summarySnippet,
      fullTranscript: `Submitted on ${today}\n\n${details}`,
    });

    // Allow native form POST to proceed (no preventDefault)
  };

  return (
    <section id="contact" className="py-32 contact-section">
      <div className="container mx-auto contact-layout">

        {/* Left Side */}
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
                  (window as unknown as Record<string, unknown> & { Calendly?: { initPopupWidget: (opts: Record<string, string>) => void } }).Calendly?.initPopupWidget({ url: 'https://calendly.com/nagarajan-kuvanta/30min' });
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

        {/* Right Side: Form */}
        <div className="contact-right">
          <div className="contact-form-card">
            <form
              className="contact-form"
              action="https://formsubmit.co/letsdothis@kuvanta.tech"
              method="POST"
              target="_blank"
              onSubmit={handleSubmit}
            >
              {/* formsubmit.co hidden config — mirrors tested HTML exactly */}
              <input ref={ccRef}      type="hidden" name="_cc"       defaultValue="" />
              <input                  type="hidden" name="_captcha"  value="false" />
              <input                  type="hidden" name="_template" value="table" />
              <input ref={subjectRef} type="hidden" name="_subject"  defaultValue="New Enquiry from Kuvanta Website" />

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
                    <option value="" disabled style={{ color: '#000' }}>Select a service...</option>
                    <option value="App Development"          style={{ color: '#000' }}>App Development</option>
                    <option value="Web Portal Development"   style={{ color: '#000' }}>Web Portal Development</option>
                    <option value="AI Automation"            style={{ color: '#000' }}>AI Automation</option>
                    <option value="PM Advisory"              style={{ color: '#000' }}>PM Advisory</option>
                    <option value="Consultation"             style={{ color: '#000' }}>Consultation</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="contact-label">BRIEF DESCRIPTION OF SERVICE EXPECTED</label>
                <textarea name="details" className="contact-input" rows={4} placeholder="Tell us about your requirements..." required />
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};
