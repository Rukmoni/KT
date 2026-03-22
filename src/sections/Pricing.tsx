import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Basic',
    price: '$2,999',
    description: 'Perfect for MVPs and simple functional apps.',
    features: ['React Native (Expo)', 'UI/UX Design (1 Theme)', 'API Integration', 'App Store Submission'],
    popular: false
  },
  {
    name: 'Standard',
    price: '$5,999',
    description: 'For growing businesses needing robust features.',
    features: ['Everything in Basic', 'Light & Dark Mode', 'Basic AI Integrations', 'Custom Animations', '3 Months Support'],
    popular: true
  },
  {
    name: 'Premium',
    price: '$12,999+',
    description: 'Enterprise-grade scalable mobile platforms.',
    features: ['Everything in Standard', 'Advanced AI Features', 'Custom Backend Setup', 'Complex State Mgt', 'Priority Support'],
    popular: false
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-32 container">
      <div className="text-center mb-16">
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Transparent Pricing
        </h2>
        <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
          Choose a package that aligns with your product goals. We deliver premium quality at every tier.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 items-center" style={{ alignItems: 'stretch' }}>
        {tiers.map((tier, idx) => (
          <Card key={idx} className={`relative flex flex-col p-8 ${tier.popular ? 'border-primary' : ''}`} style={tier.popular ? { borderColor: 'var(--primary)', transform: 'scale(1.05)', zIndex: 10 } : {}}>
            {tier.popular && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-glow" style={{ background: 'var(--gradient-primary)' }}>
                Most Popular
              </span>
            )}
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{tier.name}</h3>
            <p className="text-secondary mb-6">{tier.description}</p>
            <div className="text-4xl font-bold mb-8">{tier.price}</div>
            
            <div className="flex-1 flex flex-col gap-4 mb-8">
              {tier.features.map((feat, fIdx) => (
                <div key={fIdx} className="flex items-center gap-3">
                  <Check className="text-primary" size={20} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            
            <Button variant={tier.popular ? 'primary' : 'outline'} fullWidth>
              Get Started
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};
