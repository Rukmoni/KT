import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './ShowcaseCarousel.css';
import '../sections/Hero.css';

const screens = [
  {
    id: 1,
    title: 'Smart Dashboard',
    description: 'Track revenue, pending payments & insights in real-time',
    imageUrl: '/carousel-images/C_img1.png',
    videoUrl: '/paymentVideo.mov',
    category: 'Dashboard',
  },
  {
    id: 2,
    title: 'AI Invoice Generator',
    description: 'Create professional invoices instantly with AI assistance',
    imageUrl: '/carousel-images/C_img11.jpg',
    videoUrl: '/demovideo1.mov',
    category: 'Invoicing',
  },
  {
    id: 3,
    title: 'Seamless Payments',
    description: 'Accept payments via Stripe, Razorpay & more',
    imageUrl: '/carousel-images/C_img2.png',
    category: 'Payments',
  },
  {
    id: 4,
    title: 'Advanced Analytics',
    description: 'Visual charts for growth, cashflow & client behavior',
    imageUrl: '/carousel-images/C_img3.png',
    category: 'Analytics',
  },
  {
    id: 5,
    title: 'Payment Reminders',
    description: 'Never miss a due date with smart scheduling',
    imageUrl: '/carousel-images/C_img4.png',
    category: 'Calendar',
  },
];

const TiltCard = ({ children, isActive, title, description, category, videoUrl }: { children: string, isActive: boolean, title: string, description: string, category: string, videoUrl?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      // Play video when slide is active
      videoRef.current.play().catch(e => console.log("Video playback prevented:", e));
    } else if (!isActive && videoRef.current) {
      // Pause and reset video when slide is inactive
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ rotateX: isActive ? rotateX : 0, rotateY: isActive ? rotateY : 0, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`mockup-frame group ${isActive ? 'active-frame' : ''}`}
      whileHover={{ scale: isActive ? 1.05 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-reflection"></div>
      
      {/* Show Video if available, playing only when active. Otherwise show still image. */}
      {videoUrl ? (
        <>
          {isActive ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              autoPlay
              className="slide-img object-cover w-full h-full"
            />
          ) : (
            <img
              src={children}
              alt={title}
              className="slide-img object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/300x600/4f46e5/ffffff?text=${title.replace(' ', '+')}`;
              }}
            />
          )}
        </>
      ) : (
        <img
          src={children}
          alt={title}
          className="slide-img object-cover w-full h-full"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/300x600/4f46e5/ffffff?text=${title.replace(' ', '+')}`;
          }}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0F1E] via-[#0B0F1E]/80 to-transparent p-6 pt-16 rounded-b-[24px] pointer-events-none transition-all duration-300 z-10">
        <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1 px-1">{category}</div>
        <h3 className="text-white text-[1.2rem] font-bold mb-2 leading-tight px-1 shadow-black">{title}</h3>
        <p className="text-gray-300 text-[0.85rem] leading-snug opacity-90 px-1">{description}</p>
      </div>

      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded-[24px] z-20">
          <span className="text-white font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] px-6 py-3 rounded-full transition-all cursor-pointer pointer-events-auto">
            Explore {category}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export const ShowcaseCarousel = () => {

  const navigate = useNavigate();

  return (
    <section className="py-32 relative overflow-hidden showcase-section">
      <div className="absolute inset-0 z-0 bg-dark-gradient"></div>
      <div className="carousel-spotlight"></div>

      <div className="container relative z-10">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          initialSlide={3}
          slideToClickedSlide={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 50,
            depth: 150,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="showcase-swiper"
          onClick={(swiper) => {
            if (!swiper.clickedSlide) return;
            if (swiper.clickedSlide.classList.contains('swiper-slide-active')) {
              const activeScreen = screens[swiper.realIndex];
              if (activeScreen) {
                navigate(`/service/${activeScreen.category.toLowerCase()}`);
              }
            }
          }}
        >
          {screens.map((screen) => (
            <SwiperSlide key={screen.id} className="showcase-slide">
              {({ isActive }) => (
                <TiltCard
                  isActive={isActive}
                  title={screen.title}
                  description={screen.description}
                  category={screen.category}
                  videoUrl={screen.videoUrl}
                >
                  {screen.imageUrl}
                </TiltCard>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section >
  );
};
