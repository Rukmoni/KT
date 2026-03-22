import { Card } from '../components/Card';
import './Portfolio.css';

const projects = [
  {
    title: 'E-Commerce AI App',
    category: 'Retail',
    screens: ['Home', 'Product', 'Cart', 'Payment'],
    color: 'from-blue-500 to-indigo-500' // used via css class mapping
  },
  {
    title: 'FinTech Dashboard',
    category: 'Finance',
    screens: ['Overview', 'Transfer', 'Investments'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Health & Fitness Tracker',
    category: 'Lifestyle',
    screens: ['Dashboard', 'Workout', 'Profile'],
    color: 'from-emerald-500 to-teal-500'
  }
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="py-32 container">
      <div className="text-center mb-16">
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Recent Transformations
        </h2>
        <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
          See how our AI-driven design methodology translates into stunning, high-converting digital products.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <Card key={idx} className="portfolio-card p-0" glowOnHover={false}>
            <div className={`portfolio-image-placeholder color-${idx}`}>
              <div className="mock-ui overlay">
                <div className="mock-ui-header"></div>
                <div className="mock-ui-body"></div>
                <div className="mock-ui-footer"></div>
              </div>
            </div>
            <div className="portfolio-content" style={{ padding: '1.5rem' }}>
              <span className="text-secondary font-semibold" style={{ fontSize: '0.875rem' }}>
                {project.category}
              </span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: '0.25rem' }}>
                {project.title}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {project.screens.map((screen, sIdx) => (
                  <span key={sIdx} className="screen-badge glass">
                    {screen}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
