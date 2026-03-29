import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Bot } from 'lucide-react';

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
    imageUrl: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    category: 'Dashboard',
  },
  {
    id: 2,
    title: 'AI Invoice Generator',
    description: 'Create professional invoices instantly with AI assistance',
    imageUrl: 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    category: 'Invoicing',
  },
  {
    id: 3,
    title: 'Seamless Payments',
    description: 'Accept payments via Stripe, Razorpay & more',
    imageUrl: 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    category: 'Payments',
  },
  {
    id: 4,
    title: 'Advanced Analytics',
    description: 'Visual charts for growth, cashflow & client behavior',
    imageUrl: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    category: 'Analytics',
  },
  {
    id: 5,
    title: 'Payment Reminders',
    description: 'Never miss a due date with smart scheduling',
    imageUrl: 'https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    category: 'Calendar',
  },
];

const TiltCard = ({ children, isActive, title, description, category }: { children: string, isActive: boolean, title: string, description: string, category: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

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
      {/* If images are missing, show placeholders */}
      <img
        src={children}
        alt={title}
        className="slide-img object-cover w-full h-full"
        onError={(e) => {
          e.currentTarget.src = `https://via.placeholder.com/300x600/4f46e5/ffffff?text=${title.replace(' ', '+')}`;
        }}
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0F1E] via-[#0B0F1E]/80 to-transparent p-6 pt-16 rounded-b-[24px] pointer-events-none transition-all duration-300">
        <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1 px-1">{category}</div>
        <h3 className="text-white text-[1.2rem] font-bold mb-2 leading-tight px-1 shadow-black">{title}</h3>
        <p className="text-gray-300 text-[0.85rem] leading-snug opacity-90 px-1">{description}</p>
      </div>

      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded-[24px] z-10">
          <span className="text-white font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] px-6 py-3 rounded-full transition-all cursor-pointer">
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
        <div className="mb-16 flex justify-center">
          <div className="flex flex-col gap-6 w-full max-w-6xl items-center text-center px-4 relative z-20">
            <div className="tagline flex items-center justify-center gap-2">
              <Bot className="text-secondary" size={20} />
              <span className="text-secondary font-semibold">AI-Powered Mobile App Experiences</span>
            </div>

            <div className="max-w-4xl mx-auto text-center">
              <h1 className="hero-title text-center text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Build Stunning <span className="text-gradient">AI-Powered</span><br /> Mobile Apps
              </h1>

              <p className="hero-subtitle text-secondary text-center">
                Convert your ideas into high-converting mobile experiences.
              </p>
            </div>
            {/* 
            <div className="hero-actions flex justify-center gap-4 mt-4">
              <Button size="lg" className="shadow-glow">
                Get Your App <Smartphone size={18} />
              </Button>
              <Button variant="secondary" size="lg">
                View Projects <ChevronRight size={18} />
              </Button>
            </div> */}
          </div>
        </div>

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
