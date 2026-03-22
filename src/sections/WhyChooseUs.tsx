import { CheckCircle2 } from 'lucide-react';

const reasons = [
  { title: 'Clean, Scalable Code', desc: 'Enterprise-grade architecture that grows with your business.' },
  { title: 'Lightning Fast Delivery', desc: 'Optimized workflows matching startup speeds without technical debt.' },
  { title: 'Modern UI/UX', desc: 'Premium, glassmorphic interfaces that captivate users immediately.' },
  { title: 'AI-Ready Apps', desc: 'Built flexibly to integrate any AI models (OpenAI, Gemini, Anthropic).' },
  { title: 'Cross-Platform', desc: 'Deploy to both iOS and Android simultaneously with one codebase.' }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-32 container">
      <div className="flex items-center justify-between flex-wrap gap-12">
        <div style={{ flex: '1 1 400px' }}>
          <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
            Why Choose Kuavanta?
          </h2>
          <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            We don't just write code, we engineer solutions. Our development approach bridges the gap between stunning design, AI innovation, and rock-solid performance.
          </p>
          
          <div className="flex flex-col gap-6 mt-8">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="text-primary mt-1" size={24} />
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{reason.title}</h4>
                  <p className="text-secondary">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass" style={{ flex: '1 1 400px', height: '500px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--gradient-primary)', opacity: 0.1 }}></div>
           <div className="flex items-center justify-center p-12 text-center flex-col h-full gap-6 relative z-10">
             <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>100%</span>
             </div>
             <h3 style={{ fontSize: '1.5rem' }}>Client Satisfaction Focus</h3>
             <p className="text-secondary">We communicate constantly and transparently to ensure the final product exceeds your expectations.</p>
           </div>
        </div>
      </div>
    </section>
  );
};
