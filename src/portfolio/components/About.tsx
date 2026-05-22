import { useRef } from 'react';
import { PERSON } from '../config';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';

const SKILLS = [
  'SAFe / PI Planning', 'Scrum', 'Kanban', 'Waterfall', 'Hybrid',
  'MAS Compliance', 'EPMO Governance', 'RAID Management',
  'Payments Ecosystems', 'Microservices', 'MuleSoft', 'Salesforce',
  'Azure Cloud', 'AI Delivery', 'Stakeholder Alignment',
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const visible = useScrollFadeIn(ref);

  return (
    <section
      id="about"
      ref={ref}
      className={`py-20 bg-brand-bg transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* LEFT */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="w-32 h-32 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center overflow-hidden">
              <img
                src={PERSON.headshot}
                alt={PERSON.name}
                width={128}
                height={128}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLImageElement).parentElement?.querySelector('.nm-fallback') as HTMLElement | null;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="nm-fallback hidden items-center justify-center w-full h-full">
                <span className="text-3xl font-bold text-brand-violet select-none">{PERSON.initials}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-xl bg-brand-surface border border-brand-border">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Currently Open To</span>
              </div>
              <p className="text-brand-text text-sm font-medium">{PERSON.availability}</p>
            </div>

            <div className="flex flex-col gap-3 p-4 rounded-xl bg-brand-surface border border-brand-border">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 text-brand-violet flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="text-brand-muted">{PERSON.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 text-brand-violet flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span className="text-brand-muted">25+ years enterprise delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 text-brand-violet flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                <span className="text-brand-muted">PMP® · PSM I · CSPO®</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div>
              <p className="text-brand-violet text-sm font-semibold uppercase tracking-widest mb-2">Background</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">About Me</h2>
            </div>

            <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
              I started as a software engineer and spent a decade building enterprise platforms — payments, CRM, ERP,
              security systems — across Chennai and the region. That technical foundation is what separates my delivery
              leadership from pure project managers: I understand architecture, integration risk, and engineering
              constraints at a level that makes me effective in rooms with both CTOs and business owners.
            </p>

            <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
              Over the past 15 years, I have led programme and portfolio delivery in three highly regulated sectors —
              Telecom (M1 Digital Labs / Keppel), Energy (Petronas ICT), and BFSI (Standard Chartered Bank, AIG).
              As a SAFe Agile delivery manager and digital transformation consultant, my focus has always been the same:
              build delivery rigour that scales, reduce the noise that slows teams down, and ship outcomes that hold up
              under audit.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-muted text-xs font-medium hover:border-brand-violet hover:text-brand-text transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
