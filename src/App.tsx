import { ThemeToggle } from './components/ThemeToggle';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { AIFeatures } from './sections/AIFeatures';
import { Portfolio } from './sections/Portfolio';
import { TechStack } from './sections/TechStack';
import { WhyChooseUs } from './sections/WhyChooseUs';
import { Testimonials } from './sections/Testimonials';
import { Pricing } from './sections/Pricing';
import { Video } from './sections/Video';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

function App() {
  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar glass">
        <div className="container flex justify-between items-center" style={{ height: '70px' }}>
          <div className="text-2xl font-bold text-gradient">Kuavanta</div>
          <div className="flex items-center gap-6">
            <a href="#services" className="hidden md:block">Services</a>
            <a href="#portfolio" className="hidden md:block">Portfolio</a>
            <a href="#pricing" className="hidden md:block">Pricing</a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Services />
        <AIFeatures />
        <Portfolio />
        <TechStack />
        <WhyChooseUs />
        <Testimonials />
        <Pricing />
        <Video />
        <Contact />
      </main>

      <Footer />

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          border-radius: 0;
          border-top: none;
          border-left: none;
          border-right: none;
        }
        main {
          padding-top: 70px;
        }
        .hidden { display: none; }
        @media (min-width: 768px) {
          .md\\:block { display: block; }
        }
      `}</style>
    </div>
  );
}

export default App;
