import { useEffect, useRef } from 'react';
import { PORTFOLIO_CONFIG } from '../config';

const BADGES = [
  { label: 'PMP® Certified', pos: 'top-4 -left-4 sm:-left-12' },
  { label: 'PSM I · CSPO®', pos: 'top-1/3 -right-4 sm:-right-14' },
  { label: '25 Years Delivery', pos: 'bottom-16 -left-4 sm:-left-14' },
  { label: 'KL · Global', pos: 'bottom-4 -right-4 sm:-right-12' },
];

export function Hero() {
  const gridRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = gridRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let frame: number;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 48;
      ctx.strokeStyle = 'rgba(124,58,237,0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      // Animated radial glow
      const gx = canvas.width * 0.6 + Math.sin(t * 0.005) * 40;
      const gy = canvas.height * 0.5 + Math.cos(t * 0.004) * 30;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 400);
      grad.addColorStop(0, 'rgba(124,58,237,0.08)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      t++;
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-bg pt-16">
      <canvas
        ref={gridRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-violet/40 bg-brand-violet/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse-slow" />
              <span className="text-brand-cyan text-xs font-semibold tracking-widest uppercase">
                {PORTFOLIO_CONFIG.tagline}
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text leading-tight">
              {PORTFOLIO_CONFIG.name}
            </h1>

            {/* H2 */}
            <h2 className="text-xl sm:text-2xl font-semibold text-brand-violet leading-snug">
              {PORTFOLIO_CONFIG.subtitle}
              <br />
              <span className="text-brand-muted font-normal text-lg">{PORTFOLIO_CONFIG.sectors}</span>
            </h2>

            {/* Body */}
            <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-xl">
              25 years of enterprise delivery — from hands-on engineering to leading $20M+ portfolios,
              45+ microservice platforms, and cross-border programme governance across MAS-regulated and
              EPMO-governed environments. Now consulting independently through{' '}
              <a href="https://kuvanta.tech" target="_blank" rel="noopener noreferrer" className="text-brand-violet hover:text-brand-violet-light transition-colors">
                Kuvanta
              </a>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo('experience')}
                className="px-6 py-3 bg-brand-violet hover:bg-brand-violet-light text-white font-semibold rounded-lg transition-colors duration-200"
                aria-label="View career experience"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="px-6 py-3 border border-brand-violet text-brand-violet hover:bg-brand-violet/10 font-semibold rounded-lg transition-colors duration-200"
                aria-label="Go to contact section"
              >
                Let's Connect
              </button>
            </div>

            {/* Social row */}
            <div className="flex items-center gap-4 pt-1">
              <a
                href={PORTFOLIO_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="flex items-center gap-2 text-brand-muted hover:text-brand-violet transition-colors duration-200 text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <span className="text-brand-border">|</span>
              <a
                href={PORTFOLIO_CONFIG.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kuvanta website"
                className="flex items-center gap-2 text-brand-muted hover:text-brand-violet transition-colors duration-200 text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                kuvanta.tech
              </a>
              <span className="text-brand-border">|</span>
              <a
                href={`mailto:${PORTFOLIO_CONFIG.email}`}
                aria-label="Send email"
                className="flex items-center gap-2 text-brand-muted hover:text-brand-violet transition-colors duration-200 text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email
              </a>
            </div>
          </div>

          {/* RIGHT — Avatar */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-violet via-brand-violet-dim to-transparent opacity-40 blur-2xl scale-110" aria-hidden="true" />
              {/* Avatar circle */}
              <div className="relative w-full h-full rounded-full border-2 border-brand-violet/50 overflow-hidden bg-brand-surface flex items-center justify-center">
                {/* Swap src to /nagarajan.jpg once photo is available */}
                <img
                  src={PORTFOLIO_CONFIG.avatar}
                  alt="Nagarajan Maheswaran — IT Delivery Manager, Kuala Lumpur"
                  width={320}
                  height={320}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.nm-fallback') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback initials */}
                <div
                  className="nm-fallback absolute inset-0 hidden items-center justify-center"
                  aria-label="NM initials placeholder"
                >
                  <span className="text-6xl font-bold text-brand-violet select-none">NM</span>
                </div>
              </div>

              {/* Floating badges */}
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  className={`absolute ${b.pos} px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border text-brand-text text-xs font-semibold whitespace-nowrap shadow-lg`}
                >
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40" aria-hidden="true">
        <span className="text-brand-muted text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-brand-muted to-transparent" />
      </div>
    </section>
  );
}
