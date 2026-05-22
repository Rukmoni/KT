import { useRef } from 'react';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';

const CERTS = [
  {
    name: 'PMP® — Project Management Professional',
    body: 'Project Management Institute',
    abbr: 'PMI',
    color: 'bg-rose-900/30 text-rose-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
  },
  {
    name: 'PSM I — Professional Scrum Master',
    body: 'Scrum.org',
    abbr: 'PSM',
    color: 'bg-sky-900/30 text-sky-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
    ),
  },
  {
    name: 'CSPO® — Certified Scrum Product Owner',
    body: 'Scrum Alliance',
    abbr: 'CSA',
    color: 'bg-emerald-900/30 text-emerald-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
  },
  {
    name: 'PMI Generative AI — Generative AI in Practice',
    body: 'Project Management Institute',
    abbr: 'PMI',
    color: 'bg-brand-violet/20 text-brand-violet-light',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    name: 'IBM AI Product Manager',
    body: 'IBM / Coursera',
    abbr: 'IBM',
    color: 'bg-blue-900/30 text-blue-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
  },
  {
    name: 'AI-First Product Leader',
    body: 'LinkedIn Learning',
    abbr: 'LI',
    color: 'bg-cyan-900/30 text-brand-cyan',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
  },
];

export function Certifications() {
  const ref = useRef<HTMLElement>(null);
  const visible = useScrollFadeIn(ref);

  return (
    <section
      id="certifications"
      ref={ref}
      className={`py-20 bg-brand-surface transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-brand-violet text-sm font-semibold uppercase tracking-widest mb-2">Credentials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">Certifications</h2>
          <p className="text-brand-muted mt-2">PMI · Scrum.org · Scrum Alliance · IBM · LinkedIn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERTS.map((cert) => (
            <div
              key={cert.name}
              className="flex flex-col gap-4 p-5 rounded-xl bg-brand-bg border border-brand-border hover:border-brand-violet/60 hover:shadow-[0_0_20px_rgba(124,58,237,0.12)] transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cert.color}`}>
                {cert.icon}
              </div>
              <div>
                <p className="text-brand-text font-bold text-sm leading-snug">{cert.name}</p>
                <p className="text-brand-muted text-xs mt-1">{cert.body}</p>
              </div>
              <div className="mt-auto">
                <span className="px-2.5 py-1 rounded-full border border-brand-violet/30 text-brand-violet text-xs font-semibold group-hover:bg-brand-violet/10 transition-colors">
                  Certified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
