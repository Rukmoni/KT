import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Process', href: '/#how-we-work' },
  { label: 'Why Kuvanta', href: '/#why-choose-us' },
  { label: 'PM Advisory', href: '/pm-advisory', isPM: true },
  { label: 'Demo', href: '/demos', isDemo: true },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const [path, hash] = href.split('#');
    if (path && path !== '/' && path !== location.pathname) {
      navigate(path);
      return;
    }
    if (hash) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMenuOpen(false);
  };

  const isActive = (href: string) => {
    const [path] = href.split('#');
    if (href === '/demos') return location.pathname === '/demos' || location.pathname.startsWith('/demo/');
    if (href === '/pm-advisory') return location.pathname === '/pm-advisory';
    return location.pathname === '/' && path === '/';
  };

  const handleGetStarted = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <div className="kv-nav-wrapper">
      <nav className={`kv-nav${scrolled ? ' kv-nav--scrolled' : ''}`}>
        <div className="kv-nav__inner">
          <a href="/" className="kv-nav__logo" onClick={e => { e.preventDefault(); navigate('/'); }}>
            <img src="/kuavanta-logo.png" alt="Kuvanta" className="kv-nav__logo-img" />
          </a>

          <div className="kv-nav__links">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className={`kv-nav__link${link.isDemo ? ' kv-nav__link--demo' : ''}${link.isPM ? ' kv-nav__link--pm' : ''}${isActive(link.href) ? ' kv-nav__link--active' : ''}`}
                onClick={e => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="kv-nav__actions">
            <button className="kv-nav__cta" onClick={handleGetStarted}>
              Get Started
            </button>
            <button
              className={`kv-nav__hamburger${menuOpen ? ' kv-nav__hamburger--open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`kv-nav__mobile-menu${menuOpen ? ' kv-nav__mobile-menu--open' : ''}`}>
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            className={`kv-nav__mobile-link${link.isDemo ? ' kv-nav__mobile-link--demo' : ''}${link.isPM ? ' kv-nav__mobile-link--pm' : ''}${isActive(link.href) ? ' kv-nav__mobile-link--active' : ''}`}
            onClick={e => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
        <div className="kv-nav__mobile-cta-wrap">
          <button className="kv-nav__cta kv-nav__cta--full" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
