import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './ShowcaseCarousel.css';

const screens = [
  { id: 1, title: 'Home Dashboard', image: '/app-home.png', route: 'home' },
  { id: 2, title: 'Product Detail', image: '/app-product.png', route: 'product' },
  { id: 3, title: 'Smart Cart', image: '/app-cart.png', route: 'cart' },
  { id: 4, title: 'Checkout Flow', image: '/app-checkout.png', route: 'checkout' },
  { id: 5, title: 'User Profile', image: '/app-profile.png', route: 'profile' },
];

const TiltCard = ({ children, isActive, onClick, title }: any) => {
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
      onClick={onClick}
      className={`mockup-frame group ${isActive ? 'active-frame' : ''}`}
      whileHover={{ scale: isActive ? 1.05 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-reflection"></div>
      {/* If images are missing, show placeholders */}
      <img 
        src={children} 
        alt={title} 
        className="slide-img" 
        onError={(e) => {
          e.currentTarget.src = `https://via.placeholder.com/300x600/4f46e5/ffffff?text=${title.replace(' ', '+')}`;
        }}
      />
      
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded-[24px]">
          <span className="text-white font-semibold text-lg bg-primary/90 px-6 py-3 rounded-full shadow-glow">
            Tap to explore
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
        <div className="text-center mb-16">
          <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Interactive App Showcase
          </h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '600px', fontSize: '1.2rem' }}>
            Experience our premium mobile interfaces. Swipe to explore and click to launch interactive demos.
          </p>
        </div>

        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          initialSlide={2}
          slideToClickedSlide={true}
          rewind={true}
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
        >
          {screens.map((screen) => (
            <SwiperSlide key={screen.id} className="showcase-slide">
               {({ isActive }) => (
                 <TiltCard isActive={isActive} onClick={() => isActive ? navigate(`/demo/${screen.route}`) : null} title={screen.title}>
                   {screen.image}
                 </TiltCard>
               )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
