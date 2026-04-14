import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';
import { Button } from './Button';
import './AppShowcaseCarousel.css';

interface AppScreen {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  category: string;
}

const screens: AppScreen[] = [
  {
    id: 1,
    title: 'Smart Dashboard',
    description: 'Track revenue, pending payments & insights in real-time',
    imageUrl: '/dashboard.png',
    videoUrl: '/paymentVideo.mov',
    category: 'Dashboard',
  },
  {
    id: 2,
    title: 'AI Invoice Generator',
    description: 'Create professional invoices instantly with AI assistance',
    imageUrl: '/invoice.png',
    videoUrl: '/demovideo1.mov',
    category: 'Invoicing',
  },
  {
    id: 3,
    title: 'Seamless Payments',
    description: 'Accept payments via Stripe, Razorpay & more',
    imageUrl: '/payment.png',
    videoUrl: '/paymentVideo.mov',
    category: 'Payments',
  },
  {
    id: 4,
    title: 'Advanced Analytics',
    description: 'Visual charts for growth, cashflow & client behavior',
    imageUrl: '/analytics.png',
    category: 'Analytics',
  },
  {
    id: 5,
    title: 'Payment Reminders',
    description: 'Never miss a due date with smart scheduling',
    imageUrl: '/calendar.png',
    category: 'Calendar',
  },
];

const SLIDE_INTERVAL = 5000;

const CarouselMedia = ({ screen, isActive }: { screen: AppScreen; isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  return (
    <>
      <img
        src={screen.imageUrl}
        alt={screen.title}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 z-0 ${
          screen.videoUrl && isActive ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />
      {screen.videoUrl && (
        <video
          ref={videoRef}
          src={screen.videoUrl}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 z-10 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </>
  );
};

export default function AppShowcaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % screens.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + screens.length) % screens.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goToNext, SLIDE_INTERVAL);
  }, [goToNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleManualNav = useCallback((fn: () => void) => {
    fn();
    resetTimer();
  }, [resetTimer]);

  const getSideStyle = (index: number) => {
    const diff = ((index - activeIndex) + screens.length) % screens.length;
    const normalizedDiff = diff > screens.length / 2 ? diff - screens.length : diff;

    if (normalizedDiff === 0) return { scale: 1, opacity: 1, zIndex: 30, x: 0, filter: 'blur(0px)' };
    if (Math.abs(normalizedDiff) === 1) return { scale: 0.78, opacity: 0.45, zIndex: 20, x: normalizedDiff * 55, filter: 'blur(1.5px)' };
    return { scale: 0.62, opacity: 0.2, zIndex: 10, x: normalizedDiff * 75, filter: 'blur(3px)' };
  };

  return (
    <section className="hero-showcase-section">
      <div className="hero-showcase-inner">

        {/* LEFT — 30% hero text */}
        <div className="hero-left-panel">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>THE NEURAL PULSE IS ACTIVE</span>
          </div>

          <h1 className="hero-showcase-title">
            Building Stunning{' '}
            <span className="hero-title-gradient">AI-Powered</span>{' '}
            Mobile Apps
          </h1>

          <p className="hero-showcase-subtitle">
            Create professional apps instantly with AI assistance. Our neural engine transforms
            your ideas into production-ready interfaces in seconds.
          </p>

          <div className="hero-showcase-actions">
            <Button size="lg" className="shadow-glow">
              Start Building <Smartphone size={18} />
            </Button>
            <button className="hero-demo-link" onClick={() => {}}>
              View Demo <ChevronRight size={16} />
            </button>
          </div>

          {/* Progress dots */}
          <div className="hero-dots">
            {screens.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManualNav(() => goToSlide(i))}
                className={`hero-dot ${i === activeIndex ? 'hero-dot-active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — 70% carousel */}
        <div className="hero-right-panel">
          <div className="hero-carousel-stage">

            {/* Glow orb behind active phone */}
            <div className="hero-carousel-orb" />

            {/* Phone cards */}
            <div className="hero-carousel-track">
              {screens.map((screen, index) => {
                const style = getSideStyle(index);
                const diff = ((index - activeIndex) + screens.length) % screens.length;
                const normalizedDiff = diff > screens.length / 2 ? diff - screens.length : diff;
                const isVisible = Math.abs(normalizedDiff) <= 2;
                if (!isVisible) return null;

                return (
                  <motion.div
                    key={screen.id + '-' + index}
                    className="hero-phone-card-wrapper"
                    animate={{
                      scale: style.scale,
                      opacity: style.opacity,
                      zIndex: style.zIndex,
                      x: `${style.x}%`,
                      filter: style.filter,
                    }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    onClick={() => normalizedDiff !== 0 && handleManualNav(() => goToSlide(index))}
                    style={{ cursor: normalizedDiff !== 0 ? 'pointer' : 'default' }}
                  >
                    {/* Card top label — category + title + description */}
                    <AnimatePresence mode="wait">
                      {index === activeIndex && (
                        <motion.div
                          key={activeIndex}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35 }}
                          className="hero-card-label"
                        >
                          <span className="hero-card-category">{screen.category}</span>
                          <p className="hero-card-title">{screen.title}</p>
                          <p className="hero-card-desc">{screen.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Glow ring on active */}
                    {index === activeIndex && (
                      <div className="hero-phone-glow" />
                    )}

                    {/* Phone frame */}
                    <div className="hero-phone-frame">
                      <div className="hero-phone-notch" />
                      <div className="hero-phone-screen">
                        <div className="hero-phone-inner-glow" />
                        <CarouselMedia screen={screen} isActive={index === activeIndex} />
                        {index !== activeIndex && (
                          <div className="hero-phone-overlay" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Prev / Next arrows */}
            <button
              className="hero-arrow hero-arrow-left"
              onClick={() => handleManualNav(goToPrevious)}
              aria-label="Previous"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              className="hero-arrow hero-arrow-right"
              onClick={() => handleManualNav(goToNext)}
              aria-label="Next"
            >
              <ChevronRight size={22} />
            </button>

            {/* Auto-progress bar */}
            <div className="hero-progress-bar-wrap">
              <motion.div
                className="hero-progress-bar"
                key={activeIndex}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
