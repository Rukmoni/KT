import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Wallet, CreditCard, PieChart, Calendar, FileText, ArrowUpRight, Clock, Activity } from 'lucide-react';

type HighlightItemType = {
  id: number;
  title: string;
  desc: string;
  bgClass: string;
  glowClass: string;
  mainStat: string;
  stats: { label: string; value: string; icon: React.ElementType; colorClass: string }[];
  chartTitle: string;
};

const HIGHLIGHTS = [
  {
    id: 1,
    title: 'Smart Financial Dashboard',
    desc: 'Track earnings, pending payments, and insights in real-time.',
    bgClass: 'bg-[#0B1221]', // Deep navy
    glowClass: 'from-blue-500/30 to-purple-500/30',
    mainStat: '$12,450.00',
    stats: [
      { label: 'Total Earnings', value: '$12,300', icon: ArrowUpRight, colorClass: 'text-emerald-400' },
      { label: 'Pending', value: '$2,300', icon: Clock, colorClass: 'text-amber-400' },
      { label: 'Overdue', value: '$5,200', icon: FileText, colorClass: 'text-rose-400' },
    ],
    chartTitle: 'Recent Invoices',
  },
  {
    id: 2,
    title: 'AI Invoice Generator',
    desc: 'Create professional invoices instantly with AI assistance.',
    bgClass: 'bg-[#1e1b2e]', // Deep purple
    glowClass: 'from-purple-500/30 to-pink-500/30',
    mainStat: '142 Invoices',
    stats: [
      { label: 'Generated', value: '124', icon: FileText, colorClass: 'text-indigo-400' },
      { label: 'Paid', value: '98', icon: Wallet, colorClass: 'text-emerald-400' },
      { label: 'Drafts', value: '4', icon: FileText, colorClass: 'text-gray-400' },
    ],
    chartTitle: 'Invoice Volume',
  },
  {
    id: 3,
    title: 'Seamless Payments',
    desc: 'Accept payments via Stripe, Razorpay & more.',
    bgClass: 'bg-[#0d1f2d]', // Deep blue/teal
    glowClass: 'from-cyan-500/30 to-blue-500/30',
    mainStat: '$45,200.50',
    stats: [
      { label: 'Stripe', value: '$32,100', icon: CreditCard, colorClass: 'text-blue-400' },
      { label: 'Razorpay', value: '$12,050', icon: CreditCard, colorClass: 'text-indigo-400' },
      { label: 'Wire Transfer', value: '$1,050', icon: Wallet, colorClass: 'text-teal-400' },
    ],
    chartTitle: 'Payment Methods',
  },
  {
    id: 4,
    title: 'Advanced Analytics',
    desc: 'Visual charts for growth, cashflow & client behavior.',
    bgClass: 'bg-[#2a171c]', // Deep rose/burgundy
    glowClass: 'from-rose-500/30 to-orange-500/30',
    mainStat: '+24.5% Growth',
    stats: [
      { label: 'MRR', value: '$8,400', icon: Activity, colorClass: 'text-rose-400' },
      { label: 'Churn', value: '1.2%', icon: PieChart, colorClass: 'text-rose-500' },
      { label: 'LTV', value: '$4,200', icon: ArrowUpRight, colorClass: 'text-emerald-400' },
    ],
    chartTitle: 'Revenue Trends',
  },
  {
    id: 5,
    title: 'Payment Reminders',
    desc: 'Never miss a due date with smart scheduling.',
    bgClass: 'bg-[#16211e]', // Deep emerald
    glowClass: 'from-emerald-500/30 to-teal-500/30',
    mainStat: '12 Scheduled',
    stats: [
      { label: 'Tomorrow', value: '3', icon: Calendar, colorClass: 'text-emerald-400' },
      { label: 'This Week', value: '8', icon: Calendar, colorClass: 'text-teal-400' },
      { label: 'Overdue', value: '1', icon: Clock, colorClass: 'text-rose-400' },
    ],
    chartTitle: 'Upcoming Due Dates',
  },
];

const PhoneMockup = ({ item }: { item: HighlightItemType }) => (
  <div className={`w-full h-full rounded-[2.5rem] overflow-hidden relative ${item.bgClass} flex flex-col p-5 font-sans text-white border border-white/5`}>
    {/* Status Bar */}
    <div className="flex justify-between items-center px-2 text-[10px] font-medium opacity-80 mb-4 mt-1">
      <span>19:21</span>
      <div className="flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2,22l20-20V22H2z" /></svg>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S15.31,18,12,18z"/></svg>
        <div className="w-5 h-2.5 border border-current rounded-sm flex items-center p-[1px]">
          <div className="w-full h-full bg-current rounded-[1px]"></div>
        </div>
      </div>
    </div>

    {/* Header */}
    <div className="flex justify-between items-center mb-6 px-1 z-10">
      <h3 className="text-xl font-semibold tracking-tight">
        {item.id === 1 ? 'Hello, Rukmani 👋' : item.title}
      </h3>
      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold border-2 border-[#111827] shadow-lg">R</div>
    </div>

    {/* Main Card */}
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-4 shadow-lg z-10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
      <p className="text-xs text-gray-400 mb-1 font-medium">{item.id === 1 ? 'Total Balance' : 'Current Value'}</p>
      <h2 className="text-3xl font-bold mb-4 tracking-tighter shadow-black/50 drop-shadow-sm">{item.mainStat}</h2>
      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
        <span className="bg-emerald-400/10 px-1.5 py-0.5 rounded text-emerald-300 border border-emerald-400/20">+2.4%</span>
        <span className="text-gray-400">vs last month</span>
      </div>
    </div>

    {/* Stats row */}
    <div className="space-y-2 z-10">
      {item.stats.map((stat, i: number) => (
        <div key={i} className="bg-white/[0.03] backdrop-blur-md rounded-xl p-3.5 flex items-center justify-between border border-white/5 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.colorClass} bg-white/5 shadow-inner`}>
              <stat.icon size={16} className="opacity-90"/>
            </div>
            <span className="text-sm font-medium opacity-90">{stat.label}</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">{stat.value}</span>
        </div>
      ))}
    </div>

    {/* Bottom Chart Area Placehloder */}
    <div className="mt-4 bg-white/[0.02] backdrop-blur-md border border-white/5 p-4 rounded-2xl z-10 flex-1 flex flex-col justify-end relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <p className="text-xs font-medium text-gray-400 mb-4 relative z-10">{item.chartTitle}</p>
      <div className="relative h-16 w-full flex items-end justify-between gap-1.5 opacity-80 px-1 z-10">
        {[40, 60, 45, 80, 50, 75, 90, 65].map((h, i) => (
          <div key={i} className="w-full bg-indigo-500/80 rounded-t-sm shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all duration-500 hover:h-full" style={{ height: `${h}%` }}></div>
        ))}
      </div>
    </div>
  </div>
);

export const HighLights = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % HIGHLIGHTS.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + HIGHLIGHTS.length) % HIGHLIGHTS.length);
  const setSlide = (index: number) => setActiveIndex(index);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      prevSlide();
    } else if (info.offset.x < -swipeThreshold) {
      nextSlide();
    }
  };

  const getSpacing1 = () => {
    if (isMobile) return 140;
    if (isTablet) return 220;
    return 300;
  };

  const getSpacing2 = () => {
    if (isMobile) return 260;
    if (isTablet) return 400;
    return 550;
  };

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-[#0B0F1A] to-[#0A0D14] overflow-hidden text-white min-h-[900px]">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400"
        >
          Product Highlights
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Explore powerful features designed for modern businesses
        </motion.p>
      </div>

      <div className="relative w-full max-w-screen-2xl mx-auto h-[600px] flex items-center justify-center perspective-[2000px]">
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 sm:left-6 md:left-12 z-50 p-3 sm:p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 transition-all hover:scale-110 shadow-xl hidden sm:block"
          aria-label="Previous Highlight"
        >
          <ChevronLeft className="w-6 h-6 text-white/80" />
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-2 sm:right-6 md:right-12 z-50 p-3 sm:p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 transition-all hover:scale-110 shadow-xl hidden sm:block"
          aria-label="Next Highlight"
        >
          <ChevronRight className="w-6 h-6 text-white/80" />
        </button>

        {/* Carousel Items */}
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence initial={false}>
            {HIGHLIGHTS.map((item, index) => {
              let offset = index - activeIndex;
              if (offset < -2) offset += HIGHLIGHTS.length;
              if (offset > 2) offset -= HIGHLIGHTS.length;

              const isCenter = offset === 0;
              const isLeft1 = offset === -1;
              const isRight1 = offset === 1;
              const isLeft2 = offset === -2;
              const isRight2 = offset === 2;

              let scale = 1;
              let x = 0;
              let zIndex = 0;
              let opacity = 0;
              let blur = 0;
              let rotateY = 0;

              if (isCenter) {
                scale = 1;
                x = 0;
                zIndex = 30;
                opacity = 1;
                blur = 0;
                rotateY = 0;
              } else if (isLeft1) {
                scale = 0.85;
                x = -getSpacing1();
                zIndex = 20;
                opacity = 0.5;
                blur = 2;
                rotateY = 15; // Optional 3D effect
              } else if (isRight1) {
                scale = 0.85;
                x = getSpacing1();
                zIndex = 20;
                opacity = 0.5;
                blur = 2;
                rotateY = -15;
              } else if (isLeft2) {
                scale = 0.7;
                x = -getSpacing2();
                zIndex = 10;
                opacity = 0.15;
                blur = 6;
                rotateY = 25;
              } else if (isRight2) {
                scale = 0.7;
                x = getSpacing2();
                zIndex = 10;
                opacity = 0.15;
                blur = 6;
                rotateY = -25;
              } else {
                scale = 0.5;
                x = offset < 0 ? -(getSpacing2() + 200) : (getSpacing2() + 200);
                zIndex = 0;
                opacity = 0;
              }

              return (
                <motion.div
                  key={item.id}
                  className="absolute cursor-pointer transform-gpu"
                  onClick={() => !isCenter && setSlide(index)}
                  initial={false}
                  animate={{
                    opacity,
                    scale,
                    x,
                    zIndex,
                    rotateY,
                    filter: `blur(${blur}px)`,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1] // Apple-like smooth spring
                  }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  whileHover={!isCenter ? { scale: scale + 0.02, opacity: opacity + 0.2 } : { scale: 1.01 }}
                >
                  <div className={`
                    w-[280px] h-[580px] md:w-[320px] md:h-[640px] lg:w-[340px] lg:h-[680px] 
                    rounded-[3rem] p-2 bg-[#1C1C1F] shadow-2xl
                    border border-gray-700/50 flex flex-col items-center relative
                  `}>
                    {/* Active Glow Behind Phone */}
                    <AnimatePresence>
                      {isCenter && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`absolute -inset-10 bg-gradient-to-tr ${item.glowClass} blur-3xl rounded-full -z-10`}
                        />
                      )}
                    </AnimatePresence>

                    {/* Phone Frame Ring */}
                    <div className="absolute inset-0 rounded-[3rem] border-4 border-[#2C2C30] pointer-events-none z-30"></div>
                    <div className="absolute inset-1 rounded-[2.8rem] border border-black/50 pointer-events-none z-30"></div>

                    {/* Dynamic Island Notch */}
                    <div className="absolute top-4 inset-x-0 h-7 flex justify-center z-40 pointer-events-none">
                      <div className="w-[100px] h-[28px] bg-black rounded-full flex items-center justify-between px-2 shadow-inner">
                         <div className="w-2 h-2 rounded-full bg-[#0a0a0a] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] ml-1"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-[#050505] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] border border-white/5 mr-1"></div>
                      </div>
                    </div>

                    <PhoneMockup item={item} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Active Item Description */}
      <div className="mt-12 text-center max-w-xl mx-auto px-4 h-28 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">{HIGHLIGHTS[activeIndex].title}</h3>
            <p className="text-gray-400 text-base md:text-lg">{HIGHLIGHTS[activeIndex].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center space-x-3 mt-4 relative z-10 pb-10">
        {HIGHLIGHTS.map((_, index) => (
          <button
            key={index}
            onClick={() => setSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === activeIndex 
                ? 'w-10 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
