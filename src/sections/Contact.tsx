import { Mail } from 'lucide-react';
import { useLeadStore } from '../store/leadStore';
import { sendEmail } from '../services/emailService';
import './Contact.css';

export const Contact = () => {
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
                kuvanta.tech@gmail.com
              </div>
            </div>

        
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="contact-right">
          <div className="contact-form-card">
            <form className="contact-form" onSubmit={(e) => {
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
              
              sendEmail({
                toEmail: 'kuvanta.tech@gmail.com',
                ccEmail: email,
                subject: `New Inquiry: ${service} - ${name}`,
                body: requestBody
              });
              
              useLeadStore.getState().addLead({
                  source: 'Contact Form',
                  name: name,
                  email: email,
                  phone: phone,
                  serviceType: service,
                  summary: summarySnippet,
                  fullTranscript: requestBody
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
                    <option value="Consultation" style={{ color: '#000' }}>Consultation</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="contact-label">BRIEF DESCRIPTION OF SERVICE EXPECTED</label>
                <textarea name="details" className="contact-input" rows={4} placeholder="Tell us about your requirements..." required></textarea>
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
