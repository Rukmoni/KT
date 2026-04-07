import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './components/ThemeToggle';
import { Footer } from './sections/Footer';
import { Home } from './pages/Home';
import { DemoPage } from './pages/DemoPage';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/demo/:screenName" element={<DemoPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Floating Pill Navigation Bar */}
        <nav className="navbar-container">
          <div className="pill-glass">
            <div className="navbar-logo">
              <img src="/kuavanta-logo.png" alt="Kuavanta" className="logo-image" />
            </div>

            <div className="navbar-links">
              <a href="/#services">Services</a>
              <a href="/#how-we-work">How we work?</a>
              <a href="/#why-choose-us">Why us?</a>
            </div>

            <div className="navbar-actions">
              {/*    <ThemeToggle /> */}
              <button className="nav-btn-primary hidden md:block">Get Started</button>
            </div>
          </div>
        </nav>

        <AnimatedRoutes />

        <Footer />

        <style>{`
          .navbar-container {
            position: fixed;
            top: 1.5rem;
            left: 0;
            right: 0;
            z-index: 50;
            display: flex;
            justify-content: center;
            pointer-events: none;
            padding: 0 1.5rem;
          }

          .pill-glass {
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border);
            border-radius: 9999px;
            padding: 0.5rem 0.5rem 0.5rem 1.25rem;
            width: 100%;
            max-width: 800px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }

          .navbar-logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .logo-image {
            height: 24px;
            width: auto;
            object-fit: contain;
            margin-right: 1rem;
          }

          .navbar-links {
            display: none;
          }

          @media (min-width: 768px) {
            .navbar-links {
              display: flex;
              align-items: center;
              gap: 2rem;
            }
          }

          .navbar-links a {
            color: var(--text-secondary);
            font-size: 0.95rem;
            font-weight: 500;
            transition: color 0.3s ease;
          }

          .navbar-links a:hover {
            color: var(--text-primary);
          }

          .navbar-actions {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .nav-btn-primary {
            background: var(--text-primary);
            color: var(--bg-primary);
            border: none;
            padding: 0.6rem 1.25rem;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: transform 0.2s ease, filter 0.2s ease;
          }

          .nav-btn-primary:hover {
            transform: scale(1.02);
            filter: brightness(0.9);
          }
          
          .hidden { display: none; }
          @media (min-width: 768px) {
            .md\\:block { display: block; }
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
