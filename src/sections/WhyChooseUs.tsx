import { Code2, Zap, Palette, Bot, Smartphone } from 'lucide-react';
import './WhyChooseUs.css';

export const WhyChooseUs = () => {
  return (
    <section className="py-32 why-choose-section" id="why-choose-us">
      <div className="container mx-auto">
        <div className="mb-16" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="edge-pill mb-6">OUR COMPETITIVE EDGE</div>
          <h2 className="font-bold mb-6 why-choose-heading" style={{ lineHeight: '1.1', letterSpacing: '-0.03em' }}>
            Why Choose <br />
            <span className="text-gradient hover-glow">Kuavanta?</span>
          </h2>
          <p className="text-secondary" style={{ fontSize: '1.15rem', lineHeight: '1.6', fontFamily: 'var(--font-sans)', maxWidth: '600px', margin: '0 auto' }}>
            We don't just write code, we engineer solutions. Our development approach bridges the gap between stunning design, AI innovation, and rock-solid performance.
          </p>
        </div>

        <div className="features-grid">
           {/* Row 1 */}
           <div className="feature-card">
              <div className="icon-box"><Code2 size={22} className="glossy-icon" /></div>
              <h3>Clean, Scalable Code</h3>
              <p>Enterprise-grade architecture that grows with your business, ensuring your foundation is built for long-term evolution.</p>
           </div>
           
           <div className="feature-card">
              <div className="icon-box"><Zap size={22} className="glossy-icon" /></div>
              <h3>Lightning Fast Delivery</h3>
              <p>Optimized workflows matching startup speeds without technical debt, getting your product to market when it matters most.</p>
           </div>
           
           <div className="feature-card">
              <div className="icon-box"><Palette size={22} className="glossy-icon" /></div>
              <h3>Modern UI/UX</h3>
              <p>Premium, glassmorphic interfaces that captivate users immediately with editorial-level attention to aesthetic detail.</p>
           </div>

           {/* Row 2 */}
           <div className="feature-card">
              <div className="icon-box"><Bot size={22} className="glossy-icon" /></div>
              <h3>AI-Ready Apps</h3>
              <p>Built flexibly to integrate any AI models including OpenAI, Gemini, and Anthropic into the core of your user experience.</p>
           </div>
           
           <div className="feature-card span-2">
              <div className="icon-box"><Smartphone size={22} className="glossy-icon" /></div>
              <h3>Cross-Platform Dominance</h3>
              <p>Deploy to both iOS and Android simultaneously with one high-performance codebase using React Native, maximizing your reach and minimizing maintenance.</p>
           </div>
        </div>
      </div>
    </section>
  );
};
