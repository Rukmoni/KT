import { useRef, type ReactElement } from 'react';
import { SERVICES, PERSON } from '../config';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';

const SERVICE_ICONS: Record<string, ReactElement> = {
  ShieldAlert: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
    </svg>
  ),
  RefreshCw: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
  ),
  Cpu: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={1.5}/><rect x="9" y="9" width="6" height="6" strokeWidth={1.5}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>
    </svg>
  ),
  Users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  ),
};

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const visible = useScrollFadeIn(ref);

  return (
    <section
      id="services"
      ref={ref}
      className={`py-20 bg-brand-bg transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-brand-violet text-sm font-semibold uppercase tracking-widest mb-2">Kuvanta</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">Advisory Services</h2>
          <p className="text-brand-muted mt-2">Through Kuvanta — Independent PM &amp; AI Delivery Consulting</p>
          <p className="text-brand-muted text-sm mt-3 max-w-2xl">
            Available for contract engagements, fractional Delivery Manager roles, and advisory retainers.
            Contract IT project manager Malaysia-wide and globally remote as a SAFe programme manager for hire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SERVICES.map((svc) => (
            <div
              key={svc.id}
              className="group flex flex-col gap-4 p-6 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-violet/60 hover:shadow-[0_0_24px_rgba(124,58,237,0.1)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet group-hover:bg-brand-violet/20 transition-colors duration-300">
                {SERVICE_ICONS[svc.icon]}
              </div>
              <div>
                <h3 className="text-brand-text font-bold text-base mb-2">{svc.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{svc.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {svc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-violet text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={PERSON.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-brand-violet text-brand-violet hover:bg-brand-violet hover:text-white font-semibold rounded-lg transition-all duration-200"
            aria-label="Explore Kuvanta services website"
          >
            Explore Kuvanta Services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
