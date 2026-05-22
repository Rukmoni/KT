import { useState, useEffect } from 'react';
import { PORTFOLIO_CONFIG } from '../config';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-bg/90 backdrop-blur-md border-b border-brand-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group"
            aria-label="Nagarajan Maheswaran — Home"
          >
            <span className="w-9 h-9 rounded-lg bg-brand-violet flex items-center justify-center text-white font-bold text-sm tracking-wider flex-shrink-0">
              NM
            </span>
            <span className="hidden sm:block text-brand-text font-semibold text-sm tracking-widest uppercase">
              Nagarajan Maheswaran
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-brand-muted hover:text-brand-text text-sm font-medium transition-colors duration-200"
                aria-label={`Navigate to ${link.label} section`}
              >
                {link.label}
              </button>
            ))}
            <a
              href={PORTFOLIO_CONFIG.cvPdf}
              download
              className="ml-2 px-4 py-2 bg-brand-violet hover:bg-brand-violet-light text-white text-sm font-semibold rounded-lg transition-colors duration-200"
              aria-label="Download CV PDF"
            >
              Download CV
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-0.5 bg-brand-text transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-brand-text transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-brand-text transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>

        {/* Mobile drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-brand-border">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-brand-muted hover:text-brand-text px-2 py-3 text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
            <a
              href={PORTFOLIO_CONFIG.cvPdf}
              download
              className="mt-2 px-4 py-2.5 bg-brand-violet text-white text-sm font-semibold rounded-lg text-center"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
