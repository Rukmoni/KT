import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Database, CreditCard, Cpu, Code2, Zap } from 'lucide-react';
import './TechStack.css';

const categories = ['All', 'Frontend', 'Backend', 'Payments', 'AI'];

const techData = [
  { name: 'React Native', icon: <Smartphone size={24} />, category: 'Frontend', description: 'Cross-platform mobile development' },
  { name: 'Expo', icon: <Zap size={24} />, category: 'Frontend', description: 'Fast React Native framework and tools' },
  { name: 'TypeScript', icon: <Code2 size={24} />, category: 'Frontend', description: 'Strongly typed JavaScript for robust code' },
  { name: 'Zustand', icon: <Cpu size={24} />, category: 'Frontend', description: 'Small, fast, and scalable state management' },
  { name: 'Firebase', icon: <Database size={24} />, category: 'Backend', description: 'Backend-as-a-Service for realtime DBs' },
  { name: 'Supabase', icon: <Database size={24} />, category: 'Backend', description: 'Open source Firebase alternative' },
  { name: 'Stripe', icon: <CreditCard size={24} />, category: 'Payments', description: 'Infrastructure for internet payments' },
  { name: 'Razorpay', icon: <CreditCard size={24} />, category: 'Payments', description: 'Payment gateway for India and beyond' },
  { name: 'OpenAI APIs', icon: <Cpu size={24} />, category: 'AI', description: 'Industry-leading AI models and capabilities' },
];

export const TechStack = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTech = activeCategory === 'All' 
    ? techData 
    : techData.filter(t => t.category === activeCategory);

  return (
    <section className="tech-stack-section py-20 relative" id="techstack">
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gradient font-bold mb-4" 
            style={{ fontSize: '2.5rem' }}
          >
            🧰 Built With Modern Tech
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-secondary mx-auto" 
            style={{ maxWidth: '600px', fontSize: '1.2rem' }}
          >
            Using scalable, production-ready technologies for high-performance apps
          </motion.p>
        </div>

        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Tech Grid */}
        <motion.div 
          layout
          className="tech-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredTech.map((tech) => (
              <motion.div
                layout
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="tech-card-wrapper group"
              >
                <div className="tech-gradient-border"></div>
                <div className="tech-card glass">
                  <div className="tech-icon">{tech.icon}</div>
                  <span className="tech-name font-semibold">{tech.name}</span>
                </div>
                
                {/* Tooltip */}
                <div className="tech-tooltip glass">
                  {tech.description}
                  <div className="tooltip-arrow"></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="font-semibold text-secondary" style={{ letterSpacing: '1px' }}>
            ⚡ Production-ready & scalable
          </p>
        </motion.div>
      </div>
    </section>
  );
};
