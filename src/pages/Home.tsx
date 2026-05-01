
import { Services } from '../sections/Services';
import { AIFeatures } from '../sections/AIFeatures';
import { HowWeWork } from '../sections/HowWeWork';
import { WhyChooseUs } from '../sections/WhyChooseUs';
import { PMAdvisoryTeaser } from '../sections/PMAdvisoryTeaser';
import AppShowcaseCarousel from '../components/AppShowcaseCarousel';
import { Contact } from '../sections/Contact';
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppShowcaseCarousel />
      {/*  <ShowcaseCarousel /> */}
      {/*   <Hero /> */}
      <Services />
      <AIFeatures />
      <HowWeWork />
      {/*  <Portfolio /> */}
      {/*    <TechStack /> */}

      {/* <HighLights /> */}
      <WhyChooseUs />
      <PMAdvisoryTeaser />
      {/*<Testimonials />
             <Pricing />
      <Video /> */}
      <Contact />
    </motion.main>
  );
};
