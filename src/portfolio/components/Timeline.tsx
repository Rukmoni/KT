import { useRef } from 'react';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';

const SECTOR_COLORS: Record<string, string> = {
  Advisory: 'bg-emerald-900/40 text-emerald-400 border-emerald-800',
  Telecom: 'bg-blue-900/40 text-blue-400 border-blue-800',
  'Multi-sector': 'bg-amber-900/40 text-amber-400 border-amber-800',
  Energy: 'bg-orange-900/40 text-orange-400 border-orange-800',
  'BFSI · Enterprise': 'bg-brand-violet/20 text-brand-violet-light border-brand-violet/30',
};

const ENTRIES = [
  {
    company: 'Kuvanta Tech',
    initials: 'KT',
    color: 'bg-brand-violet',
    role: 'Founder & Principal Consultant',
    tenure: 'Sep 2025 – Present',
    location: 'Kuala Lumpur (Remote)',
    sector: 'Advisory',
    bullets: [
      '3 paid advisory engagements — enterprise PM rigour applied to scaling technology and product teams',
      'Completed PMI GenAI, IBM AI Product Manager, AI-First Product Leader certifications',
      'Building AI-assisted delivery frameworks for consulting clients',
    ],
  },
  {
    company: 'M1 Digital Labs (Keppel Group)',
    initials: 'M1',
    color: 'bg-blue-700',
    role: 'Senior IT Project Manager / Delivery Manager',
    tenure: 'Sep 2022 – Aug 2025',
    location: 'Kuala Lumpur',
    sector: 'Telecom',
    bullets: [
      '35% OTD improvement and 30% velocity uplift — SAFe ART facilitation across 8+ concurrent Agile workstreams in a MAS-regulated environment',
      'Zero audit findings across 3 years — sustained via RAID governance, CAB, release readiness gates across 45+ applications',
      'MAS-regulated payments platform delivered — eGIRO, PayNow, Visa, UOB, AXS, DBS — zero billing-cycle failures across all go-lives',
      'MuleSoft-to-microservices migration: multi-million dollar licensing saving, zero service disruption',
    ],
  },
  {
    company: 'Datacom Systems Asia',
    initials: 'DC',
    color: 'bg-amber-700',
    role: 'Project Manager – Cloud & Transformation Delivery',
    tenure: 'Apr 2016 – Aug 2022',
    location: 'Kuala Lumpur',
    sector: 'Multi-sector',
    bullets: [
      '$18M+ annual portfolio — CRM, cloud migration, application modernisation across Telco, public sector, enterprise accounts',
      '67% → 90%+ on-time delivery within 18 months — built Agile delivery governance from zero',
      '20% portfolio cost reduction through vendor renegotiation and workstream rationalisation',
    ],
  },
  {
    company: 'Petronas ICT Sdn Bhd',
    initials: 'PT',
    color: 'bg-orange-700',
    role: 'Project Manager – Enterprise Application Delivery',
    tenure: 'Sep 2014 – Oct 2015',
    location: 'Kuala Lumpur',
    sector: 'Energy',
    bullets: [
      'ECM, HRMS, BI, e-commerce and data migration — zero-defect delivery under strict EPMO governance',
      'USD 1M presales win contribution; received Focused Recognition Award',
    ],
  },
  {
    company: 'Earlier Career (2000–2013)',
    initials: 'EC',
    color: 'bg-slate-600',
    role: 'Project Manager / Project Leader / Senior Engineer',
    tenure: '2000 – 2013',
    location: 'Chennai · Kuala Lumpur',
    sector: 'BFSI · Enterprise',
    subtitle: 'Tentacle Technologies · Hexacorp · Virtusa (SCB) · Mphasis (AIG)',
    bullets: [
      'Built technical foundations across banking (Standard Chartered Bank), insurance (AIG), and enterprise software',
      'AIG IntelliRisk platform; COBOL-to-.NET migration (150K+ policies); SCB Compliance Portal and GTO Dashboard',
    ],
  },
];

function TimelineEntry({ entry, index }: { entry: typeof ENTRIES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollFadeIn(ref, 0.1);

  return (
    <div
      ref={ref}
      className={`relative pl-8 pb-12 last:pb-0 transition-all duration-700 delay-${Math.min(index * 100, 400)} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-brand-border" aria-hidden="true" />
      {/* Timeline dot */}
      <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full -translate-x-1/2 ${entry.color} ring-2 ring-brand-bg`} aria-hidden="true" />

      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 sm:p-6 hover:border-brand-violet/40 transition-colors duration-300 group">
        <div className="flex flex-wrap items-start gap-3 mb-3">
          {/* Logo */}
          <div className={`w-10 h-10 rounded-lg ${entry.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {entry.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-brand-text font-bold text-base sm:text-lg leading-tight">{entry.company}</h3>
            {entry.subtitle && <p className="text-brand-muted text-xs mt-0.5">{entry.subtitle}</p>}
          </div>
          <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${SECTOR_COLORS[entry.sector] || 'bg-brand-border text-brand-muted border-brand-border'}`}>
            {entry.sector}
          </span>
        </div>

        <div className="mb-3">
          <p className="text-brand-text font-semibold text-sm sm:text-base">{entry.role}</p>
          <p className="text-brand-muted text-xs mt-1">{entry.tenure} · {entry.location}</p>
        </div>

        <ul className="flex flex-col gap-2">
          {entry.bullets.map((b, i) => (
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
          {ENTRIES.map((entry, i) => (
            <TimelineEntry key={entry.company} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
