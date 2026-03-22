import { Layers, Smartphone, Flame, Cpu, Database, CreditCard } from 'lucide-react';
import './TechStack.css';

const techStack = [
  { name: 'React Native', icon: <Smartphone size={40} /> },
  { name: 'Expo', icon: <Layers size={40} /> },
  { name: 'TypeScript', icon: <Cpu size={40} /> },
  { name: 'Firebase / Supabase', icon: <Database size={40} /> },
  { name: 'Zustand', icon: <Flame size={40} /> },
  { name: 'Stripe', icon: <CreditCard size={40} /> }
];

export const TechStack = () => {
  return (
    <section id="tech" className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            Powered by Modern Technologies
          </h2>
        </div>
        
        <div className="tech-grid flex flex-wrap justify-center gap-8">
          {techStack.map((tech, idx) => (
            <div key={idx} className="tech-badge glass flex items-center gap-3">
              <span className="text-primary">{tech.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
