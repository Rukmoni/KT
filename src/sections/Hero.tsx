import { motion } from 'framer-motion';
import { Bot, ChevronRight, Smartphone } from 'lucide-react';
import { Button } from '../components/Button';
import './Hero.css';

export const Hero = () => {
  return (
    <section className="hero-section container flex items-center justify-between">
      {/* Text Content */}
      <div className="hero-content flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="tagline flex items-center gap-2"
        >
          <Bot className="text-secondary" size={20} />
          <span className="text-secondary font-semibold">AI-Powered Mobile App Experiences</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hero-title"
        >
          Build Stunning <br />
          <span className="text-gradient">AI-Powered</span> <br />
          Mobile Apps
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-subtitle text-secondary"
        >
          React Native (Expo) apps with modern UI, performance, and scalability.
          Convert your ideas into high-converting mobile experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hero-actions flex gap-4 mt-4"
        >
          <Button size="lg" className="shadow-glow">
            Get Your App <Smartphone size={18} />
          </Button>
          <Button variant="secondary" size="lg">
            View Projects <ChevronRight size={18} />
          </Button>
        </motion.div>
      </div>

      {/* Visual / 3D Mockups */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="hero-visuals hidden md:block"
      >
        <div className="mockup-container relative">
          {/* Main Phone */}
          <div className="phone-mockup phone-1 animate-float glass">
            <div className="notch"></div>
            <div className="phone-screen text-gradient-bg">
              <Bot size={48} className="text-white mb-4" />
              <div className="mockup-text line-1"></div>
              <div className="mockup-text line-2"></div>
              <div className="mockup-text line-3"></div>
            </div>
          </div>

          {/* Secondary Phone */}
          <div className="phone-mockup phone-2 animate-float glass" style={{ animationDelay: '1.5s' }}>
            <div className="notch"></div>
            <div className="phone-screen text-dark-bg">
              <div className="mockup-card"></div>
              <div className="mockup-card"></div>
            </div>
          </div>

          {/* AI Glowing Orb */}
          <div className="ai-orb"></div>
        </div>
      </motion.div>
    </section>
  );
};
