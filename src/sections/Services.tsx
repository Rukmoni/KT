import { Card } from '../components/Card';
import { Smartphone, PenTool, Cpu, Database, Layout } from 'lucide-react';
import './Services.css';

const services = [
  {
    title: 'React Native Development',
    description: 'High-performance, cross-platform mobile apps for iOS and Android.',
    icon: <Smartphone size={32} />
  },
  {
    title: 'Expo App Development',
    description: 'Rapid prototyping and scalable app delivery using the Expo ecosystem.',
    icon: <Layout size={32} />
  },
  {
    title: 'UI/UX Design',
    description: 'Beautiful, modern interfaces with Light & Dark mode support built-in.',
    icon: <PenTool size={32} />
  },
  {
    title: 'AI Features Integration',
    description: 'Smart capabilities like predictive text, chatbots, and personal recommendations.',
    icon: <Cpu size={32} />
  },
  {
    title: 'API & Backend Integration',
    description: 'Robust serverless or traditional backend connections (Firebase, Supabase, Node).',
    icon: <Database size={32} />
  }
];

export const Services = () => {
  return (
    <section id="services" className="py-32 container">
      <div className="text-center mb-16">
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Our Expertise
        </h2>
        <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
          Comprehensive app development services tailored for modern startups and businesses.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="service-card flex-col items-start gap-4" style={{ height: '100%' }}>
            <div className="icon-wrapper text-primary mb-2">
              {service.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{service.title}</h3>
            <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
              {service.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};
