import { Card } from '../components/Card';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah Jenkins',
    role: 'Founder, RetailStart',
    content: 'Kuavanta transformed our vague idea into a polished, high-performing app in record time. The UI is simply gorgeous.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'CTO, FinFlow',
    content: 'Their expertise in React Native and AI integrations is unmatched. The dark mode implementation is incredibly premium.',
    rating: 5
  },
  {
    name: 'Emma Watson',
    role: 'Product Manager, HealthSync',
    content: 'Flawless execution. The app runs smoothly on both iOS and Android, and the animations keep our users engaged.',
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <h2 className="text-center text-gradient mb-12" style={{ fontSize: '2.5rem' }}>
          Client Success Stories
        </h2>
        
        <div className="grid grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <Card key={idx} className="flex-col gap-4">
              <div className="flex text-primary mb-2">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="italic text-secondary" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                "{review.content}"
              </p>
              <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontWeight: 600 }}>{review.name}</h4>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{review.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
