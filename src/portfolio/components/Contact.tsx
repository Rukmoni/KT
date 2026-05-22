import { useRef, type ReactElement } from 'react';
import { PERSON, SOCIAL } from '../config';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';

const SOCIAL_ICONS: Record<string, ReactElement> = {
  Linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  ),
  Globe: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
};

const CONTACT_EXTRAS = [
  {
    label: 'Location',
    value: PERSON.location,
    href: null as string | null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
  },
];

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const visible = useScrollFadeIn(ref);

  return (
    <section
      id="contact"
      ref={ref}
      className={`py-20 bg-brand-surface transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-2xl bg-brand-bg border border-brand-border rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="text-brand-violet text-sm font-semibold uppercase tracking-widest mb-2">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">Let's Work Together</h2>
            <p className="text-brand-muted mt-3 text-sm sm:text-base leading-relaxed">{PERSON.availability}.</p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {SOCIAL.map((s) => (
              <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-violet/40 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-brand-violet/10 flex items-center justify-center text-brand-violet flex-shrink-0">
                  {SOCIAL_ICONS[s.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-brand-muted text-xs">{s.label}</p>
                  <a
                    href={s.url}
                    target={s.url.startsWith('http') ? '_blank' : undefined}
                    rel={s.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-brand-text text-sm font-medium hover:text-brand-violet transition-colors duration-200 truncate block"
                    aria-label={`${s.label}: ${s.url}`}
                  >
                    {s.url.replace('mailto:', '')}
                  </a>
                </div>
              </div>
            ))}
            {CONTACT_EXTRAS.map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-brand-surface border border-brand-border">
                <div className="w-10 h-10 rounded-lg bg-brand-violet/10 flex items-center justify-center text-brand-violet flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-brand-muted text-xs">{item.label}</p>
                  <p className="text-brand-text text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href={`mailto:${PERSON.email}`}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-violet hover:bg-brand-violet-light text-white font-semibold rounded-xl transition-colors duration-200"
            aria-label="Send Nagarajan a message via email"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Send Me a Message
          </a>
        </div>
      </div>
    </section>
  );
}
