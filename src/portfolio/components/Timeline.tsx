import { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { EXPERIENCE } from '../config';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';

type Entry = typeof EXPERIENCE[number];

const INITIALS: Record<string, string> = {
  kuvanta: 'KT',
  m1: 'M1',
  datacom: 'DC',
  petronas: 'PT',
  tentacle: 'TT',
  hexacorp: 'HC',
  virtusa: 'VS',
  mphasis: 'MP',
  engineering: 'EF',
};

function TimelineEntry({
  entry,
  index,
  compact = false,
}: {
  entry: Entry;
  index: number;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollFadeIn(ref, 0.1);
  const isFoundation = 'isFoundation' in entry && entry.isFoundation;

  const badgeSize = compact ? 'w-9 h-9 text-[11px]' : 'w-10 h-10 text-xs';
  const cardPadding = compact ? 'p-4 sm:p-4' : 'p-5 sm:p-6';

  return (
    <div
      ref={ref}
      className={`relative pl-8 ${compact ? 'pb-8' : 'pb-12'} last:pb-0 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${Math.min(index * 80, 320)}ms` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-brand-border" aria-hidden="true" />
      <div
        className="absolute left-0 top-1.5 w-3 h-3 rounded-full -translate-x-1/2 ring-2 ring-brand-bg"
        style={{ backgroundColor: isFoundation ? '#334155' : entry.sectorColor }}
        aria-hidden="true"
      />

      {isFoundation ? (
        /* ── Foundation card ─────────────────────────────────── */
        <div
          className={`bg-brand-surface border border-brand-border rounded-xl ${cardPadding} hover:border-[#334155]/60 transition-colors duration-300`}
          style={{ borderLeft: '3px solid #334155' }}
        >
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <div
              className={`${badgeSize} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}
              style={{ backgroundColor: '#1E293B' }}
            >
              {INITIALS[entry.id] ?? 'EF'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-brand-text font-bold text-base sm:text-lg leading-tight">
                {entry.company}
              </h3>
              {'subheading' in entry && entry.subheading && (
                <p className="text-brand-muted text-xs mt-0.5 italic">{entry.subheading}</p>
              )}
            </div>
            <span
              className="px-2.5 py-1 rounded-full border text-xs font-semibold"
              style={{ color: '#64748B', borderColor: '#334155', backgroundColor: '#1E293B' }}
            >
              {entry.sector}
            </span>
          </div>

          {'companies' in entry && Array.isArray(entry.companies) && (
            <div className="flex flex-col gap-1 mb-3 pl-1">
              {entry.companies.map((c: { name: string; location: string; period: string }) => (
                <div key={c.name} className="flex items-center gap-2 text-xs text-brand-muted">
                  <span className="w-1 h-1 rounded-full bg-[#475569] flex-shrink-0" />
                  <span className="font-medium text-[#94A3B8]">{c.name}</span>
                  <span className="text-[#475569]">·</span>
                  <span>{c.location}</span>
                  <span className="text-[#475569]">·</span>
                  <span>{c.period}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mb-3">
            <p className="text-[#94A3B8] font-semibold text-sm sm:text-base">{entry.role}</p>
            <p className="text-brand-muted text-xs mt-1">{entry.period} · {entry.location}</p>
          </div>

          {'prose' in entry && entry.prose && (
            <p className="text-brand-muted text-sm leading-relaxed mb-3">{entry.prose}</p>
          )}

          {'techTags' in entry && Array.isArray(entry.techTags) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {entry.techTags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[11px] font-medium"
                  style={{ backgroundColor: '#1E293B', color: '#64748B', border: '1px solid #334155' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Standard card ───────────────────────────────────── */
        <div className={`bg-brand-surface border border-brand-border rounded-xl ${cardPadding} hover:border-brand-violet/40 transition-colors duration-300`}>
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <div
              className={`${badgeSize} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}
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
              {'client' in entry && entry.client && (
                <p className="text-brand-muted text-xs mt-0.5">Client: {entry.client}</p>
              )}
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

          {entry.achievements.length > 0 && (
            <ul className="flex flex-col gap-2">
              {entry.achievements.map((b, i) => (
                <li key={i} className="flex gap-2.5 text-brand-muted text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan flex-shrink-0 mt-2" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function EarlyCareerDivider() {
  return (
    <div className="relative pl-8 pb-8">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-brand-border" aria-hidden="true" />
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ backgroundColor: '#1E1E2E' }} />
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap"
          style={{ color: '#475569' }}
        >
          Earlier Career — BFSI &amp; Enterprise (2000–2013)
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: '#1E1E2E' }} />
      </div>
    </div>
  );
}

export function Timeline() {
  const headRef = useRef<HTMLDivElement>(null);
  const headVisible = useScrollFadeIn(headRef);
  const [earlyExpanded, setEarlyExpanded] = useState(false);

  const mainEntries = EXPERIENCE.filter(e => !('earlyCareer' in e && e.earlyCareer));
  const earlyEntries = EXPERIENCE.filter(e => 'earlyCareer' in e && e.earlyCareer);

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
          {/* ── Main entries (2013–present) ── */}
          {mainEntries.map((entry, i) => (
            <TimelineEntry key={entry.id} entry={entry} index={i} compact={false} />
          ))}

          {/* ── Divider ── */}
          <EarlyCareerDivider />

          {/* ── Early entries — always visible on desktop, toggled on mobile ── */}
          <div className="sm:hidden mb-4">
            <button
              onClick={() => setEarlyExpanded(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-colors duration-200"
              style={{
                borderColor: '#1E1E2E',
                backgroundColor: '#12121A',
                color: '#64748B',
              }}
            >
              <span>{earlyExpanded ? 'Hide earlier career (2000–2013)' : 'Show earlier career (2000–2013)'}</span>
              {earlyExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          <div className={`sm:block ${earlyExpanded ? 'block' : 'hidden'}`}>
            {earlyEntries.map((entry, i) => (
              <TimelineEntry
                key={entry.id}
                entry={entry}
                index={mainEntries.length + i + 1}
                compact={true}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
