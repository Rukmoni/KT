import { MessageCircle, Mail, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import './Contact.css';

export const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-secondary">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Let's Build Your App
          </h2>
          <p className="text-secondary" style={{ fontSize: '1.2rem' }}>
            Ready to transform your idea into reality? Contact us today.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Direct Contact Links */}
          <div className="flex flex-col gap-6" style={{ flex: 1 }}>
            <Card className="flex items-center gap-4 cursor-pointer hover:border-primary border border-transparent transition-colors">
              <div className="p-3 rounded-full" style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366' }}>
                <MessageCircle size={32} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>WhatsApp</h4>
                <p className="text-secondary">Message us directly for a quick reply.</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4 cursor-pointer hover:border-primary border border-transparent transition-colors">
              <div className="p-3 rounded-full" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
                <Mail size={32} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Email</h4>
                <p className="text-secondary">hello@kuavanta.dev</p>
              </div>
            </Card>
          </div>

          {/* Form */}
          <Card style={{ flex: 1.5 }} className="contact-form-card">
            <form className="flex flex-col gap-4">
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" placeholder="john@company.com" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" rows={4} placeholder="Tell us about your project..."></textarea>
              </div>
              <Button type="button" size="lg" className="mt-2 w-full flex justify-center items-center gap-2">
                Send Message <Send size={18} />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};
