import { Card } from '../components/Card';
import { Search, MessageSquare, ThumbsUp, Mic, Wand2, Zap } from 'lucide-react';
import './AIFeatures.css';

const aiFeatures = [
  {
    title: 'Smart Search',
    description: 'AI-driven suggestions and typo-tolerant rapid search abilities.',
    icon: <Search size={28} />
  },
  {
    title: 'Chatbot Assistant',
    description: 'Intelligent conversational agents to handle support and FAQs.',
    icon: <MessageSquare size={28} />
  },
  {
    title: 'Personalized Recommendations',
    description: 'Tailored content feeds based on user activity and behavior models.',
    icon: <ThumbsUp size={28} />
  },
  {
    title: 'Voice Search',
    description: 'Accurate speech-to-text integration for hands-free app navigation.',
    icon: <Mic size={28} />
  },
  {
    title: 'Predictive UI',
    description: 'Interfaces that adapt locally depending on user context and time of day.',
    icon: <Wand2 size={28} />
  },
  {
    title: 'Dynamic Content',
    description: 'Real-time generation of text and image assets using GenAI APIs.',
    icon: <Zap size={28} />
  }
];

export const AIFeatures = () => {
  return (
    <section id="ai-features" className="py-32 relative overflow-hidden">
      <div className="glow-background"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <span className="badge text-secondary mb-4 inline-block">Highlight</span>
          <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Next-Gen AI Capabilities
          </h2>
          <p className="text-secondary" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem' }}>
            We don't just build apps. We build intelligent platforms that predict, automate, and delight your users.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {aiFeatures.map((feat, index) => (
            <Card key={index} className="ai-feature-card">
              <div className="ai-icon-wrapper mb-4 text-white">
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{feat.title}</h3>
              <p className="text-secondary">
                {feat.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
