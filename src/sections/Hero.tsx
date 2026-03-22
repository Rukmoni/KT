import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronRight, Smartphone, Monitor } from 'lucide-react';
import { Button } from '../components/Button';
import './Hero.css';

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  /*   useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
      }, 6000);
      return () => clearInterval(timer);
    }, []); */

  return (
    <section className="hero-section container relative">
      <AnimatePresence mode="wait">
        {currentSlide === 0 && (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            className="hero-slide flex items-center justify-between"
          >
            {/* Text Content */}
            <div className="hero-content flex-col gap-6">
              <div className="tagline flex items-center gap-2">
                <Bot className="text-secondary" size={20} />
                <span className="text-secondary font-semibold">AI-Powered Mobile App Experiences</span>
              </div>

              <h1 className="hero-title">
                Build Stunning <br />
                <span className="text-gradient">AI-Powered</span> <br />
                Mobile Apps
              </h1>

              <p className="hero-subtitle text-secondary">
                React Native (Expo) apps with modern UI, performance, and scalability.
                Convert your ideas into high-converting mobile experiences.
              </p>

              <div className="hero-actions flex gap-4 mt-4">
                <Button size="lg" className="shadow-glow">
                  Get Your App <Smartphone size={18} />
                </Button>
                <Button variant="secondary" size="lg">
                  View Projects <ChevronRight size={18} />
                </Button>
              </div>
            </div>

            {/* Visual / 3D Mockups */}
            <div className="hero-visuals hidden md:block">
              <div className="mockup-container relative">
                {/* Main Phone */}
                <div className="phone-mockup phone-1 animate-float glass">
                  <div className="notch"></div>
                  <div className="phone-screen text-gradient-bg flex justify-center items-center flex-col">
                    <img src="/kuavanta-logo.png" alt="Kuavanta" style={{ width: '85%', objectFit: 'contain', marginBottom: '2rem' }} />
                    <div className="mockup-text line-1"></div>
                    <div className="mockup-text line-2"></div>
                    <div className="mockup-text line-3"></div>
                  </div>
                </div>

                {/* Secondary Phone */}
                <div className="phone-mockup phone-2 animate-float glass" style={{ animationDelay: '1.5s' }}>
                  <div className="notch"></div>
                  <div className="phone-screen text-dark-bg flex justify-center items-center flex-col" style={{ padding: '15px' }}>
                    <img src="/kuavanta-logo.png" alt="Kuavanta" style={{ width: '70%', objectFit: 'contain', opacity: 0.6, marginBottom: '1rem' }} />
                    <div className="mockup-card"></div>
                    <div className="mockup-card"></div>
                  </div>
                </div>

                {/* AI Glowing Orb */}
                <div className="ai-orb"></div>
              </div>
            </div>
          </motion.div>
        )}

        {currentSlide === 1 && (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            className="hero-slide flex items-center justify-between"
          >
            {/* Text Content */}
            <div className="hero-content flex-col gap-6">
              <div className="tagline flex items-center gap-2">
                <Monitor className="text-secondary" size={20} />
                <span className="text-secondary font-semibold">Desktop & Web Ecosystems</span>
              </div>

              <h1 className="hero-title">
                Next-Generation <br />
                <span className="text-gradient">Interfaces</span> <br />
              </h1>

              <p className="hero-subtitle text-secondary">
                Seamless design experiences that span across desktop and web.
                We craft breathtaking, futuristic retail and SaaS dashboards.
              </p>

              <div className="hero-actions flex gap-4 mt-4">
                <Button size="lg" className="shadow-glow">
                  Start Your Project <ChevronRight size={18} />
                </Button>
              </div>
            </div>

            {/* Visual / Desktop Mockup */}
            <div className="hero-visuals hidden md:block">
              <div className="desktop-mockup-container relative">
                {/* Note: The user attached an image, please place it as public/hero-slide2.png */}
                <img
                  src="/hero-slide2.png"
                  alt="Desktop Retail UI Mockup"
                  className="desktop-image-mockup shadow-glow animate-float"
                />
                <div className="ai-orb" style={{ filter: 'hue-rotate(90deg)' }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel Navigation */}
      <div className="carousel-nav flex justify-center gap-3 mt-8">
        <button
          onClick={() => setCurrentSlide(0)}
          className={`dot ${currentSlide === 0 ? 'active' : ''}`}
          aria-label="Go to slide 1"
        />
        <button
          onClick={() => setCurrentSlide(1)}
          className={`dot ${currentSlide === 1 ? 'active' : ''}`}
          aria-label="Go to slide 2"
        />
      </div>
    </section>
  );
};
