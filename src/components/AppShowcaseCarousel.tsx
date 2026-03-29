import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AppScreen {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const screens: AppScreen[] = [
  {
    id: 1,
    title: 'Smart Dashboard',
    description: 'Track revenue, pending payments & insights in real-time',
    imageUrl: '/dashboard.png',
    category: 'Dashboard',
  },
  {
    id: 2,
    title: 'AI Invoice Generator',
    description: 'Create professional invoices instantly with AI assistance',
    imageUrl: '/invoice.png',
    category: 'Invoicing',
  },
  {
    id: 3,
    title: 'Seamless Payments',
    description: 'Accept payments via Stripe, Razorpay & more',
    imageUrl: '/payment.png',
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
    id: 2,
    title: 'AI Invoice Generator',
    description: 'Create professional invoices instantly with AI assistance',
    imageUrl: '/invoice.png',
    category: 'Invoicing',
  },
  {
    id: 5,
    title: 'Payment Reminders',
    description: 'Never miss a due date with smart scheduling',
    imageUrl: '/calendar.png',
    category: 'Calendar',
  },
];

export default function AppShowcaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [dragStartX, setDragStartX] = useState(0);

  const handleDragStart = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragStartX(info.point.x);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragDistance = info.point.x - dragStartX;
    const threshold = 50;

    if (dragDistance > threshold) {
      goToPrevious();
    } else if (dragDistance < -threshold) {
      goToNext();
    }
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? screens.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === screens.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const getCardStyle = (index: number) => {
    let diff = index - activeIndex;

    if (diff > screens.length / 2) {
      diff -= screens.length;
    } else if (diff < -screens.length / 2) {
      diff += screens.length;
    }

    if (diff === 0) {
      return {
        scale: 1,
        opacity: 1,
        zIndex: 30,
        x: 0,
        filter: 'blur(0px)',
      };
    } else if (Math.abs(diff) === 1) {
      return {
        scale: 0.75,
        opacity: 0.4,
        zIndex: 20,
        x: diff * 60,
        filter: 'blur(2px)',
      };
    } else {
      return {
        scale: 0.6,
        opacity: 0.2,
        zIndex: 10,
        x: diff * 80,
        filter: 'blur(4px)',
      };
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#0a0f1e] via-[#1a1332] to-[#0a0f1e] py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 gap-6">
        <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 pt-12 md:pt-20">

          <div className="w-full max-w-5xl flex flex-col items-center text-center gap-6">

            {/* Tagline */}
            <div className="flex items-center justify-center">
              <span className="text-sm md:text-base font-semibold text-emerald-300 tracking-wide">
                AI-Powered Mobile App Experiences
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
              Build Stunning <br />
              <span className="bg-gradient-to-r from-emerald-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Mobile Apps
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300/80 text-base md:text-lg lg:text-xl max-w-2xl">
              Convert your ideas into high-converting mobile experiences with
              premium UI, seamless performance, and AI-driven features.
            </p>

          </div>
        </div>
        {/*    <div className="text-center mb-16">
          <div className="hero-content flex flex-col items-center justify-center gap-6 text-center">
            <div className="tagline flex items-center justify-center gap-2">
              <span className="text-secondary font-semibold text-center">AI-Powered Mobile App Experiences</span>
            </div>

            <h1 className="hero-title text-center">
              Build Stunning <br />
              <span className="text-gradient">AI-Powered</span> <br />
              Mobile Apps
            </h1>

            <p className="hero-subtitle text-secondary text-center">
              Convert your ideas into high-converting mobile experiences.
            </p>
          </div>
                <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300/80 max-w-3xl mx-auto"
          >
            Designed for freelancers & SMEs to manage invoices, payments, and analytics
          </motion.p> 
        </div> */}

        <div className="w-full flex justify-center mt-12 md:mt-18">
          <div className="relative w-full max-w-6xl h-[550px] md:h-[650px] flex items-center justify-center">
            <AnimatePresence mode="sync">
              {screens.map((screen, index) => {
                const style = getCardStyle(index);
                let diff = index - activeIndex;

                if (diff > screens.length / 2) {
                  diff -= screens.length;
                } else if (diff < -screens.length / 2) {
                  diff += screens.length;
                }

                const isVisible = Math.abs(diff) <= 2;

                if (!isVisible) return null;

                return (
                  <motion.div
                    key={screen.id}
                    className="absolute cursor-pointer top-1/2"
                    initial={{ opacity: 0, scale: 0.8, y: '-50%' }}
                    animate={{
                      scale: style.scale,
                      opacity: style.opacity,
                      zIndex: style.zIndex,
                      x: style.x + '%',
                      y: '-50%',
                      filter: style.filter,
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: '-50%' }}
                    transition={{
                      duration: 0.5,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    drag={index === activeIndex ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onClick={() => index !== activeIndex && goToSlide(index)}
                    whileHover={
                      index !== activeIndex
                        ? { scale: style.scale * 1.05 }
                        : undefined
                    }
                  >
                    <div className="relative flex flex-col items-center">
                      {index === activeIndex && (
                        <div className="absolute top-0 w-[240px] md:w-[300px] h-[480px] md:h-[600px] rounded-[3rem] bg-gradient-to-r from-emerald-500/40 via-violet-500/40 to-emerald-500/40 blur-[60px] -z-10 animate-pulse" />
                      )}
                      <div className="relative w-[240px] md:w-[300px] h-[480px] md:h-[600px] bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-[3rem] p-3 shadow-2xl border border-white/10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-5 md:h-6 bg-black/80 backdrop-blur-sm rounded-b-2xl z-10" />

                        <div className="relative w-full h-full bg-gradient-to-br from-gray-900/90 via-gray-950/90 to-black/90 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10 pointer-events-none" />

                          <img
                            src={screen.imageUrl}
                            alt={screen.title}
                            className={`w-full h-full ${index === activeIndex ? 'object-contain scale-100' : 'object-cover'} transition-transform duration-500`}
                            loading="lazy"
                            style={{ imageRendering: 'high-quality' }}
                          />

                          {/* Only darken non-active slides to make the center one pop more clearly */}
                          {index !== activeIndex && (
                            <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300" />
                          )}
                        </div>
                      </div>

                      {index === activeIndex && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-8 w-[320px] md:w-[450px] flex justify-center pointer-events-none z-20">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center pointer-events-auto"
                          >
                            <div className="inline-block mb-3 px-4 py-1.5 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full">
                              <span className="text-sm font-medium text-emerald-300 uppercase tracking-wider">
                                {screen.category}
                              </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                              {screen.title}
                            </h3>
                            <p className="text-gray-300/70 max-w-md mx-auto px-4">
                              {screen.description}
                            </p>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-emerald-500/20 hover:border-emerald-400/30 transition-all group shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-emerald-500/20 hover:border-emerald-400/30 transition-all group shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 mt-40">
          {screens.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                ? 'w-8 bg-gradient-to-r from-emerald-500 to-violet-500 shadow-lg shadow-emerald-500/50'
                : 'w-2 bg-white/20 hover:bg-white/30'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>


    </section>
  );
}
