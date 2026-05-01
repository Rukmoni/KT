import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './PMAdvisory.css';
import { TrendingUp, Shield, Users, Zap, Layers, CircleCheck as CheckCircle, ChevronRight, ArrowRight, ChartBar as BarChart2, Settings, Target, Brain } from 'lucide-react';
import './PMAdvisory.css';

const metrics = [
  { value: 18, suffix: 'M+', prefix: '$', label: 'Portfolio managed' },
  { value: 35, suffix: '%', prefix: '', label: 'On-time delivery uplift' },
  { value: 30, suffix: '%', prefix: '', label: 'Velocity improvement' },
  { value: 20, suffix: '%', prefix: '', label: 'Cost reduction' },
  { value: 15, suffix: '+', prefix: '', label: 'Years PM leadership' },
];

const SEGMENTS = [
  { id: 'presales', label: 'Presales & Initiation', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', angle: 0 },
  { id: 'governance', label: 'Governance Setup', color: '#34d399', bg: 'rgba(52,211,153,0.12)', angle: 45 },
  { id: 'delivery', label: 'Delivery Execution', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', angle: 90 },
  { id: 'agile', label: 'Agile Coaching', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', angle: 135 },
  { id: 'risk', label: 'Risk & Monitoring', color: '#f87171', bg: 'rgba(248,113,113,0.12)', angle: 180 },
  { id: 'stakeholder', label: 'Stakeholder Mgmt', color: '#34d399', bg: 'rgba(52,211,153,0.12)', angle: 225 },
  { id: 'ai', label: 'AI Workflows', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', angle: 270 },
  { id: 'capability', label: 'Capability Transfer', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', angle: 315 },
];

const SEGMENT_DETAILS: Record<string, { title: string; points: string[] }> = {
  presales: {
    title: 'Presales & Initiation',
    points: ['Scope definition & estimation', 'Business case development', 'Project charter creation', 'Stakeholder identification', 'Risk pre-assessment'],
  },
  governance: {
    title: 'Governance Setup',
    points: ['Governance framework design', 'Change Control Board setup', 'RAID log configuration', 'Reporting cadence design', 'Audit-readiness protocols'],
  },
  delivery: {
    title: 'Delivery Execution',
    points: ['Milestone tracking & scheduling', 'Resource planning & forecasting', 'Dependency management', 'Release coordination', 'Hypercare management'],
  },
  agile: {
    title: 'Agile Coaching',
    points: ['Sprint planning & facilitation', 'Backlog refinement & hygiene', 'SAFe PI Planning events', 'ART launch & synchronisation', 'Velocity & capacity coaching'],
  },
  risk: {
    title: 'Risk & Monitoring',
    points: ['Risk identification & mitigation', 'Delivery health dashboards', 'Governance cadence design', 'Issue escalation frameworks', 'Zero audit findings record'],
  },
  stakeholder: {
    title: 'Stakeholder Management',
    points: ['Executive reporting & alignment', 'C-suite communication', 'Vendor governance & SLAs', 'Cross-functional coordination', 'Multi-vendor programme oversight'],
  },
  ai: {
    title: 'AI-Assisted Workflows',
    points: ['AI status report generation', 'Meeting documentation automation', 'Risk log AI prompting', 'Backlog story drafting', 'JIRA & Confluence integration'],
  },
  capability: {
    title: 'Capability Transfer',
    points: ['Internal PM maturity building', 'Team coaching & mentoring', 'Framework documentation', 'Process handover protocols', 'Knowledge base creation'],
  },
};

const METHODOLOGIES = [
  {
    id: 'agile',
    tag: 'Agile · Scrum & Kanban',
    tagColor: '#34d399',
    tagBg: 'rgba(52,211,153,0.1)',
    title: 'Agile Delivery',
    desc: 'Sprint-based iterative delivery with strong ceremony discipline, backlog governance, and Kanban flow control.',
    points: [
      'Sprint planning, review & retro cadence',
      'Backlog refinement & DoD governance',
      'Daily standup facilitation',
      'Velocity tracking & sprint forecasting',
      'WIP limits, cycle time & lead time',
      'JIRA board configuration & hygiene',
    ],
    flow: ['Backlog', 'Sprint Plan', 'Daily Sync', 'Execution', 'Review', 'Retro', 'Increment'],
  },
  {
    id: 'safe',
    tag: 'SAFe · Scaled Agile',
    tagColor: '#a78bfa',
    tagBg: 'rgba(167,139,250,0.1)',
    title: 'SAFe Programme Delivery',
    desc: 'Programme-level scaled delivery — PI Planning, ART synchronisation, and multi-team governance across complex workstreams.',
    points: [
      'PI Planning facilitation (2-day events)',
      'ART launch & team synchronisation',
      'Inspect & Adapt workshops',
      'System Demo coordination',
      'Feature & epic decomposition',
      'ROAM risk tracking & PI Objectives',
    ],
    flow: ['PI Planning', 'Sprint 1–2', 'Sprint 3–4', 'Sprint 5', 'I&A'],
  },
  {
    id: 'waterfall',
    tag: 'Waterfall · SDLC',
    tagColor: '#60a5fa',
    tagBg: 'rgba(96,165,250,0.1)',
    title: 'Waterfall / Stage-Gated',
    desc: 'Structured plan-driven delivery — milestone-tracked, Change Control Board governed, fully audit-ready.',
    points: [
      'Project charter & WBS scheduling',
      'RAID log & CAB governance',
      'UAT coordination & sign-off',
      'MS Project & Confluence planning',
      'Compliance & audit documentation',
      'Release & hypercare management',
    ],
    flow: ['Initiate', 'Plan', 'Design', 'Build', 'Test', 'Deploy', 'Close'],
  },
  {
    id: 'hybrid',
    tag: 'Hybrid Delivery',
    tagColor: '#fbbf24',
    tagBg: 'rgba(251,191,36,0.1)',
    title: 'Hybrid Approach',
    desc: 'Contextual blending of Agile and Waterfall — governance rigour over iterative sprint execution, ideal for regulated environments.',
    points: [
      'Fixed milestones + iterative delivery',
      'Governance shell with sprint execution',
      'Regulated environment adaption',
      'Multi-stream programme blending',
      'Dual-mode stakeholder reporting',
      'Team coaching on model transition',
    ],
    flow: ['Charter', 'Milestones', 'Sprints', 'Governance', 'Release'],
  },
];

const PACKAGES = [
  {
    name: 'Governance Audit',
    desc: 'One-off diagnostic of your delivery governance setup.',
    items: ['Delivery health assessment', 'RAID & governance gap review', 'Risk & cadence recommendations', 'Written findings report'],
    featured: false,
  },
  {
    name: 'Advisory Retainer',
    desc: 'Ongoing fractional PM advisory on a weekly basis.',
    items: ['Weekly governance cadence', 'Sprint & backlog coaching', 'Risk monitoring support', 'Stakeholder reporting', 'AI tooling integration'],
    featured: true,
    badge: 'Most popular',
  },
  {
    name: 'Delivery Setup Sprint',
    desc: 'Intensive 2–4 week engagement to build governance from zero.',
    items: ['Planning & scheduling setup', 'Change control & RAID build', 'Team onboarding & coaching', 'Dashboard & reporting setup'],
    featured: false,
  },
  {
    name: 'Full PM Engagement',
    desc: 'End-to-end PM for a defined programme or initiative.',
    items: ['Full lifecycle ownership', 'Presales & estimation', 'Vendor & stakeholder mgmt', 'UAT & release management', 'Capability transfer'],
    featured: false,
  },
];

const AI_ITEMS = [
  { title: 'Status Reporting', desc: 'AI-assisted generation from standup notes and sprint data — consistent and fast.' },
  { title: 'Meeting Documentation', desc: 'Auto-capture of action items, decisions, and risks — reducing post-meeting overhead.' },
  { title: 'Risk Log Maintenance', desc: 'AI-prompted risk identification and log updates embedded in delivery cadence.' },
  { title: 'Backlog Assistance', desc: 'Story drafting, acceptance criteria generation, and backlog refinement support.' },
  { title: 'Delivery Intelligence', desc: 'Pattern spotting across sprint data — velocity trends and risk signals surfaced early.' },
  { title: 'Workflow Integration', desc: 'Embedding AI tools into JIRA, Confluence, Azure DevOps — fit-for-purpose, not disruptive.' },
];

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function MetricCard({ metric, animate }: { metric: typeof metrics[0]; animate: boolean }) {
  const count = useCountUp(metric.value, 1600, animate);
  return (
    <div className="pma-metric">
      <div className="pma-metric__number">
        {metric.prefix}{animate ? count : 0}{metric.suffix}
      </div>
      <div className="pma-metric__label">{metric.label}</div>
    </div>
  );
}

function LifecycleWheel({ activeSegment, onSegmentClick }: {
  activeSegment: string | null;
  onSegmentClick: (id: string) => void;
}) {
  const cx = 240, cy = 240, rOuter = 195, rInner = 130, rCore = 62;

  const toRad = (deg: number) => (deg - 90) * Math.PI / 180;

  const segmentPath = (startDeg: number, endDeg: number, r1: number, r2: number) => {
    const s1 = toRad(startDeg), e1 = toRad(endDeg);
    const x1 = cx + r1 * Math.cos(s1), y1 = cy + r1 * Math.sin(s1);
    const x2 = cx + r2 * Math.cos(s1), y2 = cy + r2 * Math.sin(s1);
    const x3 = cx + r2 * Math.cos(e1), y3 = cy + r2 * Math.sin(e1);
    const x4 = cx + r1 * Math.cos(e1), y4 = cy + r1 * Math.sin(e1);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M${x1},${y1} A${r1},${r1} 0 ${large} 1 ${x4},${y4} L${x3},${y3} A${r2},${r2} 0 ${large} 0 ${x2},${y2} Z`;
  };

  const labelPos = (angleDeg: number, r: number) => {
    const rad = toRad(angleDeg);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <svg viewBox="0 0 480 480" className="pma-wheel" role="img" aria-label="PM Advisory lifecycle wheel">
      {SEGMENTS.map((seg, i) => {
        const startDeg = i * 45 - 22.5;
        const endDeg = startDeg + 45;
        const midDeg = i * 45;
        const rLabel = (rOuter + rInner) / 2;
        const lp = labelPos(midDeg, rLabel);
        const isActive = activeSegment === seg.id;
        return (
          <g
            key={seg.id}
            onClick={() => onSegmentClick(seg.id)}
            style={{ cursor: 'pointer' }}
            className="pma-wheel__seg"
          >
            <path
              d={segmentPath(startDeg, endDeg, rInner, rOuter)}
              fill={isActive ? seg.bg : 'rgba(255,255,255,0.03)'}
              stroke={isActive ? seg.color : 'rgba(255,255,255,0.08)'}
              strokeWidth={isActive ? 1.5 : 0.5}
              style={{ transition: 'fill 0.25s, stroke 0.25s' }}
            />
            <text
              x={lp.x}
              y={lp.y - 7}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isActive ? seg.color : 'rgba(255,255,255,0.55)'}
              fontSize="10"
              fontWeight={isActive ? '600' : '400'}
              style={{ transition: 'fill 0.25s', pointerEvents: 'none', userSelect: 'none' }}
            >
              {seg.label.split(' ')[0]}
            </text>
            <text
              x={lp.x}
              y={lp.y + 7}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isActive ? seg.color : 'rgba(255,255,255,0.4)'}
              fontSize="9"
              style={{ transition: 'fill 0.25s', pointerEvents: 'none', userSelect: 'none' }}
            >
              {seg.label.split(' ').slice(1).join(' ')}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={rInner} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={rCore} fill="#0d1226" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="13" fontWeight="600">Kuvanta</text>
      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.5)" fontSize="10">PM Advisory</text>
    </svg>
  );
}

export const PMAdvisory = () => {
  const navigate = useNavigate();
  const [activeSegment, setActiveSegment] = useState<string | null>('governance');
  const [activeMethod, setActiveMethod] = useState(0);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMetricsVisible(true); },
      { threshold: 0.3 }
    );
    if (metricsRef.current) obs.observe(metricsRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSegmentClick = (id: string) => {
    setActiveSegment(prev => prev === id ? null : id);
  };

  const handleGetStarted = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const activeDetail = activeSegment ? SEGMENT_DETAILS[activeSegment] : null;
  const method = METHODOLOGIES[activeMethod];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pma-page"
    >
      {/* Hero */}
      <section className="pma-hero">
        <div className="pma-hero__glow" />
        <div className="pma-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="pma-eyebrow">Kuvanta · PM Advisory</div>
            <h1 className="pma-hero__title">
              Enterprise delivery discipline,{' '}
              <em className="pma-hero__title-em">applied where it matters most.</em>
            </h1>
            <p className="pma-hero__lead">
              Independent project management advisory for technology teams — hands-on governance setup, Agile and SAFe coaching, risk frameworks, AI workflow integration, and end-to-end delivery support. Grounded in 15+ years of regulated enterprise programme delivery across Telecom, BFSI, and Energy.
            </p>
            <div className="pma-hero__pills">
              {['SAFe Scaled Agile', 'PI Planning', 'Scrum', 'Kanban', 'Waterfall / SDLC', 'EPMO Governance', 'Hybrid Delivery', 'PMP® · PSM I · CSPO®'].map(p => (
                <span key={p} className="pma-pill">{p}</span>
              ))}
            </div>
            <div className="pma-hero__cta-row">
              <button className="pma-btn pma-btn--primary" onClick={handleGetStarted}>
                Start a Conversation <ArrowRight className="w-4 h-4" />
              </button>
              <button className="pma-btn pma-btn--ghost" onClick={() => document.getElementById('pma-packages')?.scrollIntoView({ behavior: 'smooth' })}>
                View Packages <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics */}
      <section className="pma-section pma-section--dark" ref={metricsRef}>
        <div className="pma-container">
          <div className="pma-metrics-grid">
            {metrics.map((m, i) => (
              <MetricCard key={i} metric={m} animate={metricsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle Wheel */}
      <section className="pma-section">
        <div className="pma-container">
          <div className="pma-section-header">
            <div className="pma-eyebrow">Full Delivery Lifecycle</div>
            <h2 className="pma-section-title">Advisory coverage across every phase</h2>
            <p className="pma-section-desc">Click any segment to explore what we advise on at each stage of your delivery lifecycle.</p>
          </div>
          <div className="pma-wheel-layout">
            <div className="pma-wheel-wrap">
              <LifecycleWheel activeSegment={activeSegment} onSegmentClick={handleSegmentClick} />
            </div>
            <AnimatePresence mode="wait">
              {activeDetail && (
                <motion.div
                  key={activeSegment}
                  className="pma-wheel-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="pma-wheel-detail__dot" style={{ background: SEGMENTS.find(s => s.id === activeSegment)?.color }} />
                  <h3 className="pma-wheel-detail__title">{activeDetail.title}</h3>
                  <ul className="pma-wheel-detail__list">
                    {activeDetail.points.map((p, i) => (
                      <li key={i} className="pma-wheel-detail__item">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: SEGMENTS.find(s => s.id === activeSegment)?.color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {!activeDetail && (
                <motion.div
                  key="empty"
                  className="pma-wheel-detail pma-wheel-detail--empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Target className="w-8 h-8 pma-wheel-detail__empty-icon" />
                  <p>Select a segment to explore advisory coverage</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pma-section pma-section--dark">
        <div className="pma-container">
          <div className="pma-section-header">
            <div className="pma-eyebrow">What We Advise On</div>
            <h2 className="pma-section-title">Six core advisory pillars</h2>
          </div>
          <div className="pma-services-grid">
            {[
              { icon: <Settings className="w-5 h-5" />, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', title: 'Delivery Governance Setup', desc: 'Planning, milestone tracking, scheduling, change control, and RAID management — enterprise frameworks made practical for scaling teams.' },
              { icon: <Zap className="w-5 h-5" />, color: '#34d399', bg: 'rgba(52,211,153,0.1)', title: 'Agile & Sprint Coaching', desc: 'Sprint governance, backlog hygiene, Scrum ceremonies, Kanban flow, and SAFe programme increments — contextually applied.' },
              { icon: <BarChart2 className="w-5 h-5" />, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', title: 'Risk & Progress Monitoring', desc: 'Governance cadence design, delivery health dashboards, risk identification, mitigation planning, and audit-readiness.' },
              { icon: <Users className="w-5 h-5" />, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', title: 'Stakeholder Management', desc: 'Executive reporting, C-suite alignment, vendor governance, SLA management, and cross-functional coordination.' },
              { icon: <TrendingUp className="w-5 h-5" />, color: '#f87171', bg: 'rgba(248,113,113,0.1)', title: 'Presales & Estimation', desc: 'Scope definition, effort estimation, project planning for bids, and business case development.' },
              { icon: <Layers className="w-5 h-5" />, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', title: 'End-to-End PM Support', desc: 'Full project lifecycle — initiation through closure. UAT coordination, release management, hypercare, and capability transfer.' },
            ].map((svc, i) => (
              <motion.div
                key={i}
                className="pma-svc-card"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="pma-svc-card__icon" style={{ background: svc.bg, color: svc.color }}>
                  {svc.icon}
                </div>
                <h3 className="pma-svc-card__title">{svc.title}</h3>
                <p className="pma-svc-card__desc">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Tabs */}
      <section className="pma-section">
        <div className="pma-container">
          <div className="pma-section-header">
            <div className="pma-eyebrow">Methodology Advisory</div>
            <h2 className="pma-section-title">We work in your framework</h2>
          </div>
          <div className="pma-meth-tabs">
            {METHODOLOGIES.map((m, i) => (
              <button
                key={m.id}
                className={`pma-meth-tab${activeMethod === i ? ' pma-meth-tab--active' : ''}`}
                style={activeMethod === i ? { borderColor: m.tagColor, color: m.tagColor } : {}}
                onClick={() => setActiveMethod(i)}
              >
                {m.tag}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={method.id}
              className="pma-meth-panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pma-meth-panel__left">
                <span className="pma-meth-tag" style={{ background: method.tagBg, color: method.tagColor }}>
                  {method.tag}
                </span>
                <h3 className="pma-meth-panel__title">{method.title}</h3>
                <p className="pma-meth-panel__desc">{method.desc}</p>
                <ul className="pma-meth-panel__list">
                  {method.points.map((p, i) => (
                    <li key={i}>
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: method.tagColor }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pma-meth-panel__right">
                <div className="pma-flow-label">Delivery flow</div>
                <div className="pma-flow">
                  {method.flow.map((step, i) => (
                    <>
                      <div key={step} className="pma-flow__step" style={{ borderColor: i === 0 || i === method.flow.length - 1 ? method.tagColor : undefined, color: i === 0 || i === method.flow.length - 1 ? method.tagColor : undefined }}>
                        {step}
                      </div>
                      {i < method.flow.length - 1 && <ChevronRight key={`arr-${i}`} className="pma-flow__arrow" />}
                    </>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* AI Integration */}
      <section className="pma-section pma-section--dark">
        <div className="pma-container">
          <div className="pma-ai-block">
            <div className="pma-ai-block__header">
              <div className="pma-ai-block__icon-wrap">
                <Brain className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <div>
                <div className="pma-eyebrow" style={{ textAlign: 'left', marginBottom: '0.4rem' }}>AI-Integrated PM</div>
                <h2 className="pma-section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>AI-assisted project management</h2>
                <p className="pma-section-desc" style={{ textAlign: 'left', maxWidth: '56ch' }}>
                  Kuvanta advises teams on how to selectively integrate AI tooling into delivery workflows — not as a replacement for governance discipline, but as a productivity layer that removes friction from routine PM tasks.
                </p>
              </div>
            </div>
            <div className="pma-ai-grid">
              {AI_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  className="pma-ai-item"
                  whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                >
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="pma-packages" className="pma-section">
        <div className="pma-container">
          <div className="pma-section-header">
            <div className="pma-eyebrow">Engagement Packages</div>
            <h2 className="pma-section-title">Choose your advisory model</h2>
          </div>
          <div className="pma-pkg-grid">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                className={`pma-pkg${pkg.featured ? ' pma-pkg--featured' : ''}`}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                {pkg.badge && <div className="pma-pkg__badge">{pkg.badge}</div>}
                <h3 className="pma-pkg__name">{pkg.name}</h3>
                <p className="pma-pkg__desc">{pkg.desc}</p>
                <ul className="pma-pkg__list">
                  {pkg.items.map((item, j) => (
                    <li key={j}>
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-[#34d399]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className={`pma-pkg__btn${pkg.featured ? ' pma-pkg__btn--featured' : ''}`} onClick={handleGetStarted}>
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="pma-section pma-section--dark">
        <div className="pma-container">
          <div className="pma-section-header">
            <div className="pma-eyebrow">Sectors & Platforms</div>
            <h2 className="pma-section-title">Where we've delivered</h2>
          </div>
          <div className="pma-sectors">
            {['Telecom', 'BFSI', 'Energy', 'Enterprise IT', 'Payments', 'Salesforce CRM', 'Microservices', 'Azure / Cloud', 'MuleSoft', 'JIRA · Confluence · ADO'].map(s => (
              <span key={s} className="pma-sector-tag">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pma-section pma-cta-section">
        <div className="pma-container">
          <div className="pma-cta">
            <Shield className="pma-cta__icon" />
            <h2 className="pma-cta__title">Ready to bring enterprise delivery discipline to your technology team?</h2>
            <p className="pma-cta__desc">Talk to us about your programme. No obligation, no jargon — just a focused conversation about your delivery challenges.</p>
            <button className="pma-btn pma-btn--primary pma-btn--lg" onClick={handleGetStarted}>
              Start a Conversation <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
