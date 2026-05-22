import { useRef } from 'react';
import { EXPERIENCE } from '../config';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';

const INITIALS: Record<string, string> = {
  kuvanta: 'KT',
  m1: 'M1',
  datacom: 'DC',
  petronas: 'PT',
  earlier: 'EC',
};

function TimelineEntry({ entry, index }: { entry: typeof EXPERIENCE[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollFadeIn(ref, 0.1);

  return (
    <div
      ref={ref}
      className={`relative pl-8 pb-12 last:pb-0 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${Math.min(index * 80, 320)}ms` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-brand-border" aria-hidden="true" />
      <div
        className="absolute left-0 top-1.5 w-3 h-3 rounded-full -translate-x-1/2 ring-2 ring-brand-bg"
        style={{ backgroundColor: entry.sectorColor }}
        aria-hidden="true"
      />

      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 sm:p-6 hover:border-brand-violet/40 transition-colors duration-300">
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: entry.sectorColor }}
          >
            {INITIALS[entry.id] ?? entry.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-brand-text font-bold text-base sm:text-lg leading-tight">
              {'url' in entry && entry.url ? (
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-violet transition-colors">
                  {entry.company}
                </a>
              ) : entry.company}
            </h3>
          </div>
          <span
            className="px-2.5 py-1 rounded-full border text-xs font-semibold"
            style={{ color: entry.sectorColor, borderColor: `${entry.sectorColor}44`, backgroundColor: `${entry.sectorColor}15` }}
          >
            {entry.sector}
          </span>
        </div>

        <div className="mb-3">
          <p className="text-brand-text font-semibold text-sm sm:text-base">{entry.role}</p>
          <p className="text-brand-muted text-xs mt-1">{entry.period} · {entry.location}</p>
        </div>

        <ul className="flex flex-col gap-2">
          {entry.achievements.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-brand-muted text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan flex-shrink-0 mt-2" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Timeline() {
  const headRef = useRef<HTMLDivElement>(null);
  const headVisible = useScrollFadeIn(headRef);

  return (
    <section id="experience" className="py-20 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headRef}
          className={`mb-12 transition-all duration-700 ${headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-brand-violet text-sm font-semibold uppercase tracking-widest mb-2">Work History</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">Career Timeline</h2>
          <p className="text-brand-muted mt-2">25 years · 3 sectors · $20M+ portfolios</p>
        </div>

        <div className="max-w-3xl">
          {EXPERIENCE.map((entry, i) => (
            <TimelineEntry key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
