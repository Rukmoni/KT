import { MessageCircle, Mail } from 'lucide-react';
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
                hello@kuavanta.io
              </div>
            </div>

            <div className="contact-detail">
              <span className="contact-label">WHATSAPP</span>
              <div className="contact-info-item">
                <MessageCircle size={18} style={{ color: '#a482ff' }} />
                +1 (555) 000-0000
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="contact-right">
          <div className="contact-form-card">
            <form className="contact-form">
              <div className="contact-form-row">
                <div className="form-field">
                  <label className="contact-label">NAME</label>
                  <input type="text" className="contact-input" placeholder="John Doe" />
                </div>
                <div className="form-field">
                  <label className="contact-label">COMPANY</label>
                  <input type="text" className="contact-input" placeholder="Acme Inc" />
                </div>
              </div>

              <div className="form-field">
                <label className="contact-label">PROJECT DETAILS</label>
                <textarea className="contact-input" rows={4} placeholder="Tell us about your app vision..."></textarea>
              </div>

              <button type="button" className="contact-submit-btn">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};
