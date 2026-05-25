'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Check } from 'lucide-react';
import './ServicesCarousel.css';

interface ServiceSlide {
  id: number;
  service: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  ctaText: string;
  accentColor: string;
  accentGradient: string;
  visualType: string;
  imageUrl?: string;
  videoUrl?: string;
}

const slides: ServiceSlide[] = [
  /* ── PM Advisory (7 slides) ── */
  {
    id: 1, service: 'PM Advisory',
    title: 'Strategic Product Leadership, On Demand',
    tagline: 'PM ADVISORY & FRACTIONAL',
    description: 'Embed battle-tested product managers into your team without the full-time overhead. Drive roadmaps, align stakeholders, and ship what matters — faster.',
    features: ['Roadmap strategy & prioritisation', 'Stakeholder alignment & OKRs', 'Sprint facilitation & delivery'],
    ctaText: 'Get a PM', accentColor: '#6366f1', accentGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', visualType: 'roadmap',
    imageUrl: '/carousel-images/C_img1 copy.png',
  },
  {
    id: 2, service: 'PM Advisory',
    title: 'Fractional PM — Senior Expertise, Zero Overhead',
    tagline: 'PM ADVISORY & FRACTIONAL',
    description: 'Access VP-level product thinking for a fraction of the cost. Ideal for startups scaling fast or teams between hires who still need world-class product ownership.',
    features: ['Weekly strategy & prioritisation sessions', 'Metrics frameworks & KPI design', 'Team mentorship & hiring support'],
    ctaText: 'Hire Fractional', accentColor: '#6366f1', accentGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', visualType: 'team',
    imageUrl: '/carousel-images/C_img2 copy.png',
  },
  {
    id: 3, service: 'PM Advisory',
    title: 'Agile Delivery That Ships on Time, Every Sprint',
    tagline: 'AGILE & SPRINT COACHING',
    description: 'From backlog hygiene to full Scrum ceremony facilitation — we embed agile discipline into your team so sprints are productive, predictable, and built around real outcomes.',
    features: ['Sprint governance & backlog grooming', 'Scrum ceremonies, Kanban & SAFe', 'Velocity tracking & retrospectives'],
    ctaText: 'Go Agile', accentColor: '#6366f1', accentGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', visualType: 'kanban',
    imageUrl: '/carousel-images/C_img3 copy.png',
  },
  {
    id: 4, service: 'PM Advisory',
    title: 'Enterprise Waterfall & SAFe Frameworks That Work',
    tagline: 'WATERFALL & SAFe DELIVERY',
    description: 'Governance-heavy programmes need structure without bureaucracy. We apply Waterfall and SAFe at the right level — stage-gated, milestone-driven, and audit-ready.',
    features: ['Stage-gated project lifecycle control', 'RAID management & change control', 'Milestone tracking & board reporting'],
    ctaText: 'Structure My Programme', accentColor: '#6366f1', accentGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', visualType: 'gantt',
    imageUrl: '/carousel-images/C_img4 copy.png',
  },
  {
    id: 5, service: 'PM Advisory',
    title: 'Delivery Governance Built to Withstand Scrutiny',
    tagline: 'DELIVERY GOVERNANCE SETUP',
    description: 'We design and implement the delivery infrastructure your team needs — from RAID logs and change boards to health dashboards — so every stakeholder has real-time clarity.',
    features: ['Planning, scheduling & change control', 'RAID build & governance cadence design', 'Delivery health dashboard & reporting'],
    ctaText: 'Build My Governance', accentColor: '#6366f1', accentGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', visualType: 'governance',
  },
  {
    id: 6, service: 'PM Advisory',
    title: 'Stakeholder Alignment & Risk Visibility, Always On',
    tagline: 'STAKEHOLDER & RISK MANAGEMENT',
    description: 'C-suite, vendors, and cross-functional teams aligned and informed. We manage the stakeholder landscape so you spend less time firefighting and more time delivering.',
    features: ['Executive reporting & C-suite alignment', 'Vendor governance & SLA management', 'Risk identification, monitoring & mitigation'],
    ctaText: 'Align My Stakeholders', accentColor: '#6366f1', accentGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', visualType: 'stakeholder',
  },
  {
    id: 7, service: 'PM Advisory',
    title: 'AI-Augmented PM: Smarter Delivery, Half the Admin',
    tagline: 'AI-INTEGRATED PM',
    description: 'We selectively integrate AI tooling into your delivery workflow — auto-generating status reports, turning meeting notes into Jira tasks, and surfacing risks before they escalate.',
    features: ['Auto-generate Jira tasks from meeting notes', 'AI status reports from sprint & standup data', 'Jira · Confluence · Azure DevOps integration'],
    ctaText: 'Supercharge My PM', accentColor: '#6366f1', accentGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', visualType: 'note2task',
  },

  /* ── App Development (5 slides) ── */
  {
    id: 8, service: 'App Development',
    title: 'Native Mobile Apps That Users Love',
    tagline: 'APP DEVELOPMENT',
    description: 'iOS and Android apps engineered for performance, beauty, and scale. From concept to App Store — we own the full journey and obsess over every pixel.',
    features: ['iOS & Android native apps', 'React Native cross-platform builds', 'App Store optimisation & launch'],
    ctaText: 'Build My App', accentColor: '#06b6d4', accentGradient: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', visualType: 'mobile',
  },
  {
    id: 9, service: 'App Development',
    title: 'Built to Scale From Day One',
    tagline: 'APP DEVELOPMENT',
    description: 'Rock-solid architecture with real-time features, offline support, and automated CI/CD pipelines that let you ship confidently at any scale.',
    features: ['Cloud-native architecture', 'Real-time sync & offline mode', 'Automated testing & CI/CD'],
    ctaText: 'See Our Work', accentColor: '#06b6d4', accentGradient: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', visualType: 'code',
  },
  {
    id: 10, service: 'App Development',
    title: 'Deploy AI Support Agents in Days, Not Months',
    tagline: 'AI CHATBOT AGENT',
    description: 'Context-aware AI support agents trained on your documentation, FAQs, and product data — handling customer queries instantly across web, mobile, and messaging channels.',
    features: ['Trained on your docs, FAQs & knowledge base', 'Multi-turn context-aware conversations', 'Live handoff to human agents when needed'],
    ctaText: 'Build My Chatbot', accentColor: '#06b6d4', accentGradient: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', visualType: 'chatbot',
  },
  {
    id: 11, service: 'App Development',
    title: 'Voice AI Agents That Sound and Think Human',
    tagline: 'VOICE AI AGENT',
    description: 'Natural language voice assistants that schedule, answer, route, and automate — embedded directly into your app, website, or phone system.',
    features: ['Natural language voice interactions', 'Schedule, query & automate via voice', 'Integrates with phone, app & web surfaces'],
    ctaText: 'Build My Voice Agent', accentColor: '#06b6d4', accentGradient: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', visualType: 'voice',
    imageUrl: '/carousel-images/C_img11 copy.jpg',
  },
  {
    id: 12, service: 'App Development',
    title: 'KuvantaOmniHub — One Platform, Every Channel',
    tagline: 'OMNICHANNEL PLATFORM',
    description: 'Manage all messaging channels — WhatsApp, Instagram, Facebook, Telegram, Email, and Website — from a single AI-powered control centre. Configure, monitor, and audit everything in one place.',
    features: ['WhatsApp · Instagram · FB · Telegram · Email · Web', 'AI knowledge base & smart conversation routing', 'Real-time audit log & performance analytics'],
    ctaText: 'Explore OmniHub', accentColor: '#06b6d4', accentGradient: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', visualType: 'omnichannel',
  },

  /* ── Web Development (2 slides) ── */
  {
    id: 13, service: 'Web Development',
    title: 'Web Experiences That Actually Convert',
    tagline: 'WEB DEVELOPMENT',
    description: 'Blazing-fast, pixel-perfect websites built with Next.js and React. Designed to engage, rank on Google, and turn visitors into customers from the very first scroll.',
    features: ['Next.js & React frontends', 'Core Web Vitals optimised', 'SEO-first architecture'],
    ctaText: 'Launch My Site', accentColor: '#10b981', accentGradient: 'linear-gradient(135deg,#10b981,#059669)', visualType: 'browser',
  },
  {
    id: 14, service: 'Web Development',
    title: 'Full-Stack. End-to-End. Ship Ready.',
    tagline: 'WEB DEVELOPMENT',
    description: 'From database schema to interactive UI — we design, build, and deploy complete web platforms engineered to handle real traffic and grow with your business.',
    features: ['Node.js / PostgreSQL backends', 'REST & GraphQL API design', 'DevOps, CI/CD & cloud deployment'],
    ctaText: 'Build My Platform', accentColor: '#10b981', accentGradient: 'linear-gradient(135deg,#10b981,#059669)', visualType: 'metrics',
  },

  /* ── AI Consulting (5 slides) ── */
  {
    id: 15, service: 'AI Consulting',
    title: 'Turn AI Hype Into Real Business Outcomes',
    tagline: 'AI CONSULTING',
    description: 'We cut through the noise to identify exactly where AI delivers measurable ROI for your business — then we build, integrate, and ship it. No fluff, pure impact.',
    features: ['AI readiness & ROI assessment', 'LLM integration & fine-tuning strategy', 'Responsible AI & governance frameworks'],
    ctaText: 'Explore AI Strategy', accentColor: '#a855f7', accentGradient: 'linear-gradient(135deg,#a855f7,#ec4899)', visualType: 'neural',
  },
  {
    id: 16, service: 'AI Consulting',
    title: 'Intelligent Automation at Scale',
    tagline: 'AI CONSULTING',
    description: 'Deploy AI agents that work 24/7 — handling support, classifying data, and making decisions — so your team focuses on the high-value work only humans can do.',
    features: ['Custom AI agent development', 'Workflow automation pipelines', 'Data & analytics AI integration'],
    ctaText: 'Automate My Business', accentColor: '#a855f7', accentGradient: 'linear-gradient(135deg,#a855f7,#ec4899)', visualType: 'automation',
  },
  {
    id: 17, service: 'AI Consulting',
    title: 'Note2Task — Meeting Notes Into Jira in Seconds',
    tagline: 'AI JIRA AUTOMATION',
    description: 'Upload transcripts, voice recordings, or meeting minutes and watch AI generate structured, Jira-ready work items instantly — complete with type, priority, and description.',
    features: ['Transcripts · Voice notes · Meeting minutes', 'AI-structured tasks with priority & type', 'Jira · Azure DevOps · Linear integration'],
    ctaText: 'Try Note2Task', accentColor: '#a855f7', accentGradient: 'linear-gradient(135deg,#a855f7,#ec4899)', visualType: 'jira',
  },
  {
    id: 18, service: 'AI Consulting',
    title: 'Smart Analytics — AI-Powered Business Intelligence',
    tagline: 'SMART ANALYTICS',
    description: 'Connect any data source and get instant AI-generated summaries, trend analysis, and actionable recommendations — no dashboard setup required, no data analyst needed.',
    features: ['Connect any data source in minutes', 'AI summaries & trend identification', 'Actionable recommendations, no setup needed'],
    ctaText: 'Explore Analytics', accentColor: '#a855f7', accentGradient: 'linear-gradient(135deg,#a855f7,#ec4899)', visualType: 'analytics',
  },
  {
    id: 19, service: 'AI Consulting',
    title: 'AI Workflow Automation — End Repetitive Work Forever',
    tagline: 'AI WORKFLOW AUTOMATION',
    description: 'Visual workflow builder with AI decision nodes — connect your tools, define your triggers, and let intelligent agents handle everything in between, 24 hours a day.',
    features: ['Drag-and-drop workflow builder with AI nodes', 'Trigger → Agent → Decision → Act pipeline', 'Pre-built connectors: Slack, Jira, CRM, Email'],
    ctaText: 'Automate My Workflow', accentColor: '#a855f7', accentGradient: 'linear-gradient(135deg,#a855f7,#ec4899)', visualType: 'workflow',
  },
];

const SLIDE_INTERVAL = 6000;

/* ══════════════════════════════════════════════════════════════
   VISUAL COMPONENTS
══════════════════════════════════════════════════════════════ */

const RoadmapVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-roadmap">
    <div className="svc-roadmap-track" style={{ background: `linear-gradient(90deg,transparent,${color}50,transparent)` }} />
    {[
      { q: 'Discovery', done: true,  top: 38, left: 8 },
      { q: 'Design',    done: true,  top: 60, left: 30 },
      { q: 'Build',     done: false, top: 38, left: 54 },
      { q: 'Launch',    done: false, top: 60, left: 74 },
    ].map(({ q, done, top, left }) => (
      <div key={q} className="svc-roadmap-node" style={{ top: `${top}%`, left: `${left}%` }}>
        <div className="svc-roadmap-dot" style={{ background: done ? color : 'rgba(255,255,255,0.08)', border: `2px solid ${done ? color : 'rgba(255,255,255,0.15)'}`, boxShadow: done ? `0 0 14px ${color}80` : 'none' }} />
        <div className="svc-roadmap-card" style={{ borderColor: `${color}${done ? '40' : '18'}` }}>
          <span className="svc-roadmap-q" style={{ color: done ? color : 'rgba(255,255,255,0.35)' }}>{q}</span>
          <div className="svc-roadmap-bar-wrap"><div className="svc-roadmap-bar" style={{ width: done ? '100%' : '28%', background: done ? color : 'rgba(255,255,255,0.08)' }} /></div>
          <div className="svc-roadmap-bar-wrap"><div className="svc-roadmap-bar" style={{ width: done ? '72%' : '12%', background: done ? `${color}55` : 'rgba(255,255,255,0.05)' }} /></div>
        </div>
      </div>
    ))}
    <div className="svc-float-badge" style={{ background: `${color}18`, borderColor: `${color}40`, top: '8%', right: '6%' }}>
      <span className="svc-badge-dot" style={{ background: color }} /><span style={{ color }}>On Track</span>
    </div>
    <div className="svc-float-badge svc-float-badge-sm" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', bottom: '10%', left: '4%' }}>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>14 epics · 3 sprints</span>
    </div>
    <div className="svc-roadmap-glow" style={{ background: `radial-gradient(ellipse at 50% 50%,${color}20 0%,transparent 70%)` }} />
  </div>
);

const TeamVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-team">
    <svg className="svc-team-svg" viewBox="0 0 400 280">
      {([[100,70],[300,70],[100,210],[300,210]] as [number,number][]).map(([x2,y2],i) => (
        <line key={i} x1="200" y1="140" x2={x2} y2={y2} stroke={color} strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="5 4" />
      ))}
      {[{x:55,y:45,label:'Engineering'},{x:255,y:45,label:'Design'},{x:55,y:190,label:'Marketing'},{x:255,y:190,label:'Stakeholders'}].map(({x,y,label}) => (
        <g key={label}>
          <rect x={x} y={y} width={90} height={36} rx={8} fill={`${color}10`} stroke={color} strokeOpacity="0.25" />
          <text x={x+45} y={y+22} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="inherit">{label}</text>
        </g>
      ))}
    </svg>
    <div className="svc-team-hub" style={{ border: `2px solid ${color}`, boxShadow: `0 0 36px ${color}35,inset 0 0 20px ${color}10` }}>
      <span className="svc-hub-label" style={{ color }}>PM</span>
      <span className="svc-hub-sub" style={{ color: `${color}90` }}>Fractional</span>
    </div>
    <div className="svc-float-badge" style={{ background: `${color}18`, borderColor: `${color}40`, bottom: '8%', right: '4%' }}>
      <span className="svc-badge-dot" style={{ background: color }} /><span style={{ color }}>Weekly syncs ✓</span>
    </div>
  </div>
);

const KanbanVisual = ({ color }: { color: string }) => {
  const cols = [
    { name: 'Backlog',      cards: [{ t: 'Risk Analysis', p: 'High' }, { t: 'Governance Docs', p: 'Med' }, { t: 'Stakeholder Map', p: 'Low' }] },
    { name: 'In Progress',  cards: [{ t: 'Sprint Planning', p: 'High' }, { t: 'RAID Update', p: 'Med' }] },
    { name: 'Review',       cards: [{ t: 'Status Report', p: 'Med' }] },
    { name: 'Done',         cards: [{ t: 'Kick-off ✓', p: 'Done' }, { t: 'Jira Setup ✓', p: 'Done' }] },
  ];
  const pColor = (p: string) => p === 'High' ? '#ef4444' : p === 'Done' ? '#22c55e' : p === 'Med' ? color : `${color}90`;
  return (
    <div className="svc-visual svc-visual-kanban">
      <div className="svc-kanban-sprint" style={{ background: `${color}15`, borderColor: `${color}35`, color }}>
        <span className="svc-badge-dot" style={{ background: color }} /> Sprint 6 — Active
      </div>
      <div className="svc-kanban-board">
        {cols.map(({ name, cards }) => (
          <div key={name} className="svc-kanban-col">
            <div className="svc-kanban-col-hdr">
              <span>{name}</span>
              <span className="svc-kanban-count" style={{ background: `${color}20`, color }}>{cards.length}</span>
            </div>
            {cards.map(({ t, p }) => (
              <div key={t} className="svc-kanban-card" style={{ borderColor: `${color}20` }}>
                <span className="svc-kanban-card-title">{t}</span>
                <span className="svc-kanban-badge" style={{ color: pColor(p), background: `${pColor(p)}18` }}>{p}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="svc-float-badge" style={{ background: `${color}18`, borderColor: `${color}40`, bottom: '8%', right: '4%' }}>
        <span style={{ color }}>87% velocity ↑</span>
      </div>
    </div>
  );
};

const GanttVisual = ({ color }: { color: string }) => {
  const rows = [
    { phase: 'Discovery',  start: 0,   len: 2,   done: true  },
    { phase: 'Design',     start: 1.5, len: 2,   done: true  },
    { phase: 'Build',      start: 2.5, len: 2.5, done: false },
    { phase: 'Testing',    start: 4,   len: 1.5, done: false },
    { phase: 'Launch',     start: 5,   len: 1,   done: false },
  ];
  return (
    <div className="svc-visual svc-visual-gantt">
      <div className="svc-gantt-header">
        {['W1','W2','W3','W4','W5','W6'].map(w => (
          <div key={w} className="svc-gantt-wk">{w}</div>
        ))}
      </div>
      {rows.map(({ phase, start, len, done }) => (
        <div key={phase} className="svc-gantt-row">
          <div className="svc-gantt-label">{phase}</div>
          <div className="svc-gantt-track">
            <div className="svc-gantt-bar" style={{
              marginLeft: `${(start / 6) * 100}%`,
              width: `${(len / 6) * 100}%`,
              background: done ? color : `${color}45`,
              boxShadow: done ? `0 0 8px ${color}50` : 'none',
            }} />
          </div>
        </div>
      ))}
      <div className="svc-float-badge" style={{ background: `${color}18`, borderColor: `${color}40`, top: '8%', right: '4%' }}>
        <span className="svc-badge-dot" style={{ background: color }} /><span style={{ color }}>On Schedule</span>
      </div>
    </div>
  );
};

const GovernanceVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-governance">
    <div className="svc-raid-grid">
      {[
        { letter: 'R', label: 'Risks',        count: 3, status: 'Monitored',   col: '#ef4444' },
        { letter: 'A', label: 'Assumptions',  count: 7, status: 'Validated',   col: '#f59e0b' },
        { letter: 'I', label: 'Issues',       count: 2, status: 'In Progress', col: '#3b82f6' },
        { letter: 'D', label: 'Dependencies', count: 5, status: 'On Track',    col: color    },
      ].map(({ letter, label, count, status, col }) => (
        <div key={letter} className="svc-raid-card" style={{ borderColor: `${col}28`, background: `${col}08` }}>
          <div className="svc-raid-letter" style={{ color: col, background: `${col}22` }}>{letter}</div>
          <div className="svc-raid-body">
            <span className="svc-raid-label">{label}</span>
            <span className="svc-raid-count" style={{ color: col }}>{count}</span>
          </div>
          <span className="svc-raid-status">{status}</span>
        </div>
      ))}
    </div>
    <div className="svc-gov-metrics">
      {[{ v: 'Sprint 6', l: 'Current' }, { v: '87%', l: 'Health' }, { v: '0', l: 'Blockers' }].map(({ v, l }) => (
        <div key={l} className="svc-gov-metric" style={{ borderColor: `${color}20`, background: `${color}08` }}>
          <span style={{ color, fontWeight: 700, fontSize: 16, lineHeight: 1 }}>{v}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

const StakeholderVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-stakeholder">
    <div className="svc-sh-header" style={{ color: 'rgba(255,255,255,0.6)', borderBottomColor: `${color}20` }}>
      Stakeholder Engagement Map
    </div>
    {[
      { name: 'C-Suite Exec',     level: 95, ring: 'Manage Closely' },
      { name: 'Engineering Lead', level: 82, ring: 'Keep Informed'  },
      { name: 'Finance Team',     level: 64, ring: 'Consult'        },
      { name: 'External Vendor',  level: 45, ring: 'Monitor'        },
    ].map(({ name, level, ring }) => (
      <div key={name} className="svc-sh-row">
        <span className="svc-sh-name">{name}</span>
        <div className="svc-sh-bar-track">
          <div className="svc-sh-bar-fill" style={{ width: `${level}%`, background: color, boxShadow: level > 80 ? `0 0 8px ${color}60` : 'none' }} />
        </div>
        <span className="svc-sh-ring" style={{ color: level > 80 ? color : 'rgba(255,255,255,0.4)' }}>{ring}</span>
      </div>
    ))}
    <div className="svc-float-badge" style={{ background: `${color}18`, borderColor: `${color}40`, bottom: '6%', right: '4%' }}>
      <span style={{ color }}>4 stakeholder tiers</span>
    </div>
  </div>
);

const Note2TaskVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-n2t">
    <div className="svc-n2t-split">
      <div className="svc-n2t-panel">
        <div className="svc-n2t-panel-hdr" style={{ borderBottomColor: `${color}20` }}>
          <span style={{ fontSize: 14 }}>📝</span>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 600 }}>Meeting Notes</span>
        </div>
        {['Sprint review discussed payment bug still blocking checkout...', '"Dashboard report due Friday per client..."', '"Team velocity down — needs retrospective..."'].map((line, i) => (
          <div key={i} className="svc-n2t-line" style={{ background: `${color}0a`, borderColor: `${color}15`, animationDelay: `${i * 0.1}s` }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, lineHeight: 1.5 }}>{line}</span>
          </div>
        ))}
      </div>
      <div className="svc-n2t-arrow" style={{ color }}>
        <div className="svc-n2t-ai-chip" style={{ background: `${color}20`, borderColor: `${color}40`, color }}>AI</div>
        <span style={{ fontSize: 18, opacity: 0.5 }}>→</span>
      </div>
      <div className="svc-n2t-panel">
        <div className="svc-n2t-panel-hdr" style={{ borderBottomColor: `${color}20` }}>
          <span style={{ fontSize: 14 }}>🎯</span>
          <span style={{ color, fontSize: 11, fontWeight: 600 }}>Jira Tasks</span>
        </div>
        {[
          { type: 'BUG',  title: 'Fix payment checkout',     p: 'HIGH',   tc: '#ef4444' },
          { type: 'TASK', title: 'Dashboard report by Fri',  p: 'MED',    tc: '#f59e0b' },
          { type: 'TASK', title: 'Plan retrospective session',p: 'LOW',    tc: color     },
        ].map(({ type, title, p, tc }) => (
          <div key={title} className="svc-n2t-ticket" style={{ borderColor: `${color}20`, background: `${color}08` }}>
            <span className="svc-n2t-type" style={{ background: `${tc}20`, color: tc }}>{type}</span>
            <span className="svc-n2t-ticket-title">{title}</span>
            <span className="svc-n2t-priority" style={{ color: tc }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MobileVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-mobile">
    <div className="svc-phone" style={{ borderColor: `${color}30`, boxShadow: `0 0 70px ${color}25,0 0 0 1px ${color}18` }}>
      <div className="svc-phone-notch" />
      <div className="svc-phone-screen">
        <div className="svc-app-header" style={{ borderBottomColor: `${color}18` }}>
          <div className="svc-app-avatar" style={{ background: color, boxShadow: `0 0 10px ${color}60` }} />
          <div className="svc-app-header-text">
            <div className="svc-line" style={{ width: 80, background: `${color}70` }} />
            <div className="svc-line" style={{ width: 50, height: 6, background: `${color}35` }} />
          </div>
        </div>
        <div className="svc-stat-row">
          {[{ v: '+24%', l: 'Growth' }, { v: '$12k', l: 'Revenue' }, { v: '98%', l: 'Uptime' }].map(({ v, l }, i) => (
            <div key={l} className="svc-stat-box" style={{ background: `${color}${i === 0 ? '20' : '0d'}`, borderColor: `${color}25` }}>
              <span style={{ color, fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{v}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, marginTop: 2 }}>{l}</span>
            </div>
          ))}
        </div>
        <div className="svc-chart-wrap" style={{ background: `${color}0a`, borderColor: `${color}18` }}>
          <div className="svc-bar-chart">
            {[40, 62, 48, 78, 55, 90, 68].map((h, i) => (
              <div key={i} className="svc-bar" style={{ height: `${h}%`, background: i === 5 ? color : `${color}38`, borderRadius: 3 }} />
            ))}
          </div>
        </div>
        <div className="svc-list">
          {[1, 2].map(i => (
            <div key={i} className="svc-list-item" style={{ background: `${color}08`, borderColor: `${color}18` }}>
              <div className="svc-list-dot" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              <div className="svc-line" style={{ flex: 1, background: `${color}40` }} />
              <div className="svc-line" style={{ width: 30, background: `${color}25` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="svc-float-badge" style={{ background: `${color}18`, borderColor: `${color}40`, bottom: '22%', right: '4%' }}>
      <span style={{ color }}>4.9 ★ App Store</span>
    </div>
  </div>
);

const CodeVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-code">
    <div className="svc-code-win" style={{ borderColor: `${color}20` }}>
      <div className="svc-code-bar">
        <div className="svc-code-dots">
          {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} className="svc-code-dot" style={{ background: c }} />)}
        </div>
        <span className="svc-code-fname">src/App.tsx</span>
      </div>
      <div className="svc-code-body">
        {[
          [{ t: 'const ', c: color }, { t: 'App', c: 'rgba(255,255,255,0.85)' }, { t: ' = () => {', c: 'rgba(255,255,255,0.4)' }],
          [{ t: '  return (', c: 'rgba(255,255,255,0.35)' }],
          [{ t: '    <Dashboard ', c: `${color}cc` }, { t: 'data', c: 'rgba(255,200,80,0.85)' }, { t: '={metrics} ', c: 'rgba(255,255,255,0.4)' }, { t: '/>', c: `${color}cc` }],
          [{ t: '    <Analytics ', c: `${color}cc` }, { t: 'live ', c: 'rgba(255,200,80,0.85)' }, { t: 'realtime', c: 'rgba(255,200,80,0.85)' }, { t: ' />', c: `${color}cc` }],
          [{ t: '    <Notifications ', c: `${color}cc` }, { t: 'push ', c: 'rgba(255,200,80,0.85)' }, { t: '/>', c: `${color}cc` }],
          [{ t: '  )', c: 'rgba(255,255,255,0.35)' }],
          [{ t: '}', c: 'rgba(255,255,255,0.35)' }],
        ].map((tokens, i) => (
          <div key={i} className="svc-code-line">
            <span className="svc-code-ln">{i + 1}</span>
            {tokens.map((tok, j) => <span key={j} style={{ color: tok.c }}>{tok.t}</span>)}
          </div>
        ))}
      </div>
    </div>
    <div className="svc-tech-pills">
      {['React Native','TypeScript','Node.js','AWS'].map(t => (
        <span key={t} className="svc-pill" style={{ background: `${color}15`, borderColor: `${color}30`, color }}>{t}</span>
      ))}
    </div>
    <div className="svc-float-badge" style={{ background: `${color}18`, borderColor: `${color}40`, top: '10%', right: '4%' }}>
      <span className="svc-badge-dot" style={{ background: '#28c840' }} /><span style={{ color: 'rgba(255,255,255,0.7)' }}>CI Passing</span>
    </div>
  </div>
);

const ChatbotVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-chatbot">
    <div className="svc-chat-win" style={{ borderColor: `${color}25` }}>
      <div className="svc-chat-header" style={{ borderBottomColor: `${color}20`, background: `${color}10` }}>
        <div className="svc-chat-avatar" style={{ background: color }}>🤖</div>
        <div>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>AI Support Agent</div>
          <div style={{ color: '#22c55e', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Online
          </div>
        </div>
        <div className="svc-chat-live-badge" style={{ marginLeft: 'auto', background: '#22c55e20', color: '#22c55e', borderColor: '#22c55e40' }}>Live</div>
      </div>
      <div className="svc-chat-messages">
        <div className="svc-msg svc-msg-user" style={{ background: `${color}25`, borderColor: `${color}35` }}>
          How do I reset my password?
        </div>
        <div className="svc-msg svc-msg-bot" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
          Sure! Go to <span style={{ color }}>Settings → Security → Reset Password</span>. You'll receive an email within 2 minutes.
        </div>
        <div className="svc-msg svc-msg-user" style={{ background: `${color}25`, borderColor: `${color}35` }}>
          What's included in the Pro plan?
        </div>
        <div className="svc-msg svc-msg-bot svc-msg-typing" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <span className="svc-typing-dot" /><span className="svc-typing-dot" /><span className="svc-typing-dot" />
        </div>
      </div>
    </div>
    <div className="svc-float-badge svc-float-badge-sm" style={{ background: `${color}18`, borderColor: `${color}40`, bottom: '6%', right: '4%' }}>
      <span style={{ color }}>98% resolution rate</span>
    </div>
  </div>
);

const VoiceVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-voice">
    <div className="svc-voice-stage">
      <div className="svc-voice-ring svc-ring-1" style={{ borderColor: `${color}25` }} />
      <div className="svc-voice-ring svc-ring-2" style={{ borderColor: `${color}15` }} />
      <div className="svc-voice-ring svc-ring-3" style={{ borderColor: `${color}08` }} />
      <div className="svc-voice-core" style={{ background: `${color}22`, border: `2px solid ${color}`, boxShadow: `0 0 30px ${color}40` }}>
        <span style={{ fontSize: 28 }}>🎙️</span>
        <span style={{ color, fontSize: 10, fontWeight: 600, marginTop: 4 }}>Listening</span>
      </div>
    </div>
    <div className="svc-voice-waveform">
      {[20,45,65,90,75,55,80,60,35,70,85,50,40,75,90,60,45,70,55,80].map((h, i) => (
        <div key={i} className="svc-wave-bar" style={{ height: `${h}%`, background: color, opacity: 0.5 + (h / 100) * 0.5, animationDelay: `${i * 0.06}s` }} />
      ))}
    </div>
    <div className="svc-voice-transcript" style={{ background: `${color}0e`, borderColor: `${color}25` }}>
      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontStyle: 'italic' }}>
        "Schedule a call with the PM team for Friday at 3pm..."
      </span>
    </div>
    <div className="svc-float-badge svc-float-badge-sm" style={{ background: `${color}18`, borderColor: `${color}40`, top: '6%', right: '4%' }}>
      <span style={{ color }}>99ms latency</span>
    </div>
  </div>
);

const OmnichannelVisual = ({ color }: { color: string }) => {
  const channels = [
    { name: 'WhatsApp',  icon: 'WA', col: '#25d366', cx: 80,  cy: 55  },
    { name: 'Instagram', icon: 'IG', col: '#e1306c', cx: 200, cy: 28  },
    { name: 'Facebook',  icon: 'FB', col: '#1877f2', cx: 320, cy: 55  },
    { name: 'Telegram',  icon: 'TG', col: '#229ed9', cx: 80,  cy: 225 },
    { name: 'Email',     icon: '✉',  col: '#f59e0b', cx: 200, cy: 252 },
    { name: 'Website',   icon: 'WW', col: color,     cx: 320, cy: 225 },
  ];
  return (
    <div className="svc-visual svc-visual-omni">
      <svg className="svc-omni-svg" viewBox="0 0 400 280">
        {channels.map(({ name, cx, cy, col }) => (
          <line key={name} x1="200" y1="140" x2={cx} y2={cy} stroke={col} strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 3" />
        ))}
        {channels.map(({ name, icon, col, cx, cy }) => (
          <g key={name}>
            <circle cx={cx} cy={cy} r={22} fill={`${col}18`} stroke={col} strokeOpacity="0.5" strokeWidth="1.5" />
            <text x={cx} y={cy + 5} textAnchor="middle" fill={col} fontSize="11" fontWeight="700" fontFamily="inherit">{icon}</text>
          </g>
        ))}
        <circle cx="200" cy="140" r="36" fill={`${color}15`} stroke={color} strokeOpacity="0.6" strokeWidth="2" />
        <text x="200" y="135" textAnchor="middle" fill={color} fontSize="10" fontWeight="800" fontFamily="inherit">Omni</text>
        <text x="200" y="149" textAnchor="middle" fill={color} fontSize="10" fontWeight="800" fontFamily="inherit">Hub</text>
      </svg>
      <div className="svc-omni-stats">
        {[{ v: '1.2k', l: 'Msgs/day' }, { v: '6', l: 'Channels' }, { v: '99.9%', l: 'Uptime' }].map(({ v, l }) => (
          <div key={l} className="svc-auto-stat" style={{ background: `${color}0e`, borderColor: `${color}22` }}>
            <span style={{ color, fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{v}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 3 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BrowserVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-browser">
    <div className="svc-browser-win" style={{ borderColor: `${color}20`, boxShadow: `0 24px 64px ${color}20` }}>
      <div className="svc-browser-bar">
        <div className="svc-code-dots">
          {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} className="svc-code-dot" style={{ background: c }} />)}
        </div>
        <div className="svc-url-bar" style={{ background: `${color}10`, borderColor: `${color}25` }}>
          <span style={{ color: `${color}80`, fontSize: 10 }}>🔒</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>kuvanta.tech</span>
        </div>
      </div>
      <div className="svc-browser-content">
        <div className="svc-web-hero" style={{ background: `linear-gradient(135deg,${color}14 0%,transparent 60%)` }}>
          <div className="svc-web-h1" style={{ background: color, opacity: 0.9 }} />
          <div className="svc-web-h2" style={{ background: `${color}55` }} />
          <div className="svc-web-cta-btn" style={{ background: color }} />
        </div>
        <div className="svc-web-cards">
          {[1,2,3].map(i => (
            <div key={i} className="svc-web-card" style={{ background: `${color}08`, borderColor: `${color}1c` }}>
              <div className="svc-web-icon-box" style={{ background: `${color}22` }} />
              <div className="svc-line" style={{ background: `${color}45`, marginBottom: 5 }} />
              <div className="svc-line" style={{ width: '70%', background: `${color}22` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="svc-perf-badge" style={{ bottom: '16%', right: '3%', borderColor: `${color}40`, background: `${color}15` }}>
      <span className="svc-perf-num" style={{ color }}>98</span>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>Lighthouse</span>
    </div>
  </div>
);

const MetricsVisual = ({ color }: { color: string }) => {
  const gradId = `grad${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <div className="svc-visual svc-visual-metrics">
      <div className="svc-dash-win" style={{ borderColor: `${color}20` }}>
        <div className="svc-dash-header">
          <div style={{ width: 70, height: 8, background: `${color}55`, borderRadius: 4 }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
        </div>
        <div className="svc-dash-metrics">
          {[{ v: '2.4M', l: 'Page Views' }, { v: '98%', l: 'Uptime' }, { v: '0.8s', l: 'Load Time' }].map(({ v, l }) => (
            <div key={l} className="svc-dash-metric">
              <span className="svc-m-val" style={{ color }}>{v}</span>
              <span className="svc-m-lbl">{l}</span>
            </div>
          ))}
        </div>
        <div className="svc-area-chart">
          <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d="M0,65 C40,55 70,35 100,38 C130,41 160,18 190,22 C220,26 255,10 300,6 L300,80 L0,80Z" fill={`url(#${gradId})`} />
            <path d="M0,65 C40,55 70,35 100,38 C130,41 160,18 190,22 C220,26 255,10 300,6" fill="none" stroke={color} strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="svc-tech-pills" style={{ marginTop: 12 }}>
        {['PostgreSQL','Redis','Next.js','Vercel'].map(t => (
          <span key={t} className="svc-pill" style={{ background: `${color}15`, borderColor: `${color}30`, color }}>{t}</span>
        ))}
      </div>
    </div>
  );
};

const NeuralVisual = ({ color }: { color: string }) => {
  const layers = [[{x:60,y:140}],[{x:145,y:70},{x:145,y:115},{x:145,y:165},{x:145,y:210}],[{x:235,y:85},{x:235,y:130},{x:235,y:175}],[{x:330,y:140}]];
  const edges: [number[],number[]][] = [];
  layers[0].forEach(a => layers[1].forEach(b => edges.push([[a.x,a.y],[b.x,b.y]])));
  layers[1].forEach(a => layers[2].forEach(b => edges.push([[a.x,a.y],[b.x,b.y]])));
  layers[2].forEach(a => layers[3].forEach(b => edges.push([[a.x,a.y],[b.x,b.y]])));
  return (
    <div className="svc-visual svc-visual-neural">
      <svg className="svc-neural-svg" viewBox="0 0 400 280">
        {edges.map(([[x1,y1],[x2,y2]],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeOpacity="0.18" strokeWidth="1.2" />)}
        {layers.flat().map(({x,y},i) => <circle key={i} cx={x} cy={y} r={i===0||i===8?10:7} fill={`${color}${i===0||i===8?'30':'18'}`} stroke={color} strokeOpacity={i===0||i===8?'0.8':'0.5'} strokeWidth={i===0||i===8?'2':'1.5'} />)}
        <text x="60"  y="265" textAnchor="middle" fill={`${color}70`} fontSize="10" fontFamily="inherit">Input</text>
        <text x="190" y="265" textAnchor="middle" fill={`${color}70`} fontSize="10" fontFamily="inherit">Hidden Layers</text>
        <text x="330" y="265" textAnchor="middle" fill={`${color}70`} fontSize="10" fontFamily="inherit">Output</text>
      </svg>
      <div className="svc-float-badge" style={{ background: `${color}18`, borderColor: `${color}40`, top: '6%', right: '4%' }}>
        <span style={{ color }}>GPT-4o · Claude 3</span>
      </div>
    </div>
  );
};

const AutomationVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-automation">
    <div className="svc-workflow">
      {[{icon:'📥',label:'Trigger',active:false},{icon:'🤖',label:'AI Agent',active:true},{icon:'⚡',label:'Process',active:false},{icon:'✅',label:'Done',active:false}].map(({icon,label,active},i,arr) => (
        <div key={label} className="svc-wf-step-wrap">
          <div className="svc-wf-step" style={{ background: active?`${color}28`:`${color}0e`, borderColor: active?color:`${color}28`, boxShadow: active?`0 0 24px ${color}30`:'none' }}>
            <span className="svc-wf-icon">{icon}</span>
            <span className="svc-wf-label" style={{ color: active?color:'rgba(255,255,255,0.55)' }}>{label}</span>
          </div>
          {i < arr.length - 1 && <span className="svc-wf-arrow" style={{ color: `${color}55` }}>→</span>}
        </div>
      ))}
    </div>
    <div className="svc-auto-stats">
      {[{v:'10k+',l:'Tasks/day'},{v:'24/7',l:'Active'},{v:'-80%',l:'Manual work'}].map(({v,l}) => (
        <div key={l} className="svc-auto-stat" style={{ background: `${color}0e`, borderColor: `${color}22` }}>
          <span style={{ color, fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{v}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 3 }}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

const JiraVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-jira">
    <div className="svc-jira-input" style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${color}20` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>📝</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}>Input: Q3 Planning Call Transcript</span>
      </div>
      {['Sprint review — payment bug still blocking checkout flow...', '"Analytics dashboard needed for client by Friday..."'].map((l, i) => (
        <div key={i} className="svc-jira-transcript-line">{l}</div>
      ))}
    </div>
    <div className="svc-jira-process" style={{ color }}>
      <div className="svc-jira-ai-badge" style={{ background: `${color}20`, borderColor: `${color}40`, color }}>
        <span className="svc-badge-dot" style={{ background: color }} /> AI Processing
      </div>
      <span style={{ opacity: 0.4, fontSize: 18 }}>↓</span>
    </div>
    <div className="svc-jira-output">
      {[
        { type: 'BUG',  key: 'KUV-42', title: 'Fix payment gateway checkout timeout', p: 'HIGH',  tc: '#ef4444', ts: '3h' },
        { type: 'TASK', key: 'KUV-43', title: 'Build analytics dashboard for client', p: 'MED',   tc: '#f59e0b', ts: '5h' },
        { type: 'EPIC', key: 'KUV-44', title: 'Q3 delivery roadmap & sprint planning', p: 'LOW',  tc: color,     ts: '8h' },
      ].map(({ type, key, title, p, tc, ts }) => (
        <div key={key} className="svc-jira-ticket" style={{ borderColor: `${tc}25`, background: `${tc}06` }}>
          <span className="svc-jira-type" style={{ background: `${tc}22`, color: tc }}>{type}</span>
          <span className="svc-jira-key" style={{ color: 'rgba(255,255,255,0.3)' }}>{key}</span>
          <span className="svc-jira-title">{title}</span>
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            <span className="svc-jira-estimate" style={{ color: 'rgba(255,255,255,0.4)' }}>{ts}</span>
            <span className="svc-jira-priority" style={{ color: tc, background: `${tc}20` }}>{p}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsVisual = ({ color }: { color: string }) => {
  const gradId2 = `grad2${color.replace(/[^a-z0-9]/gi,'')}`;
  return (
    <div className="svc-visual svc-visual-analytics">
      <div className="svc-analytics-kpis">
        {[{v:'↑ 24%',l:'Revenue',pos:true},{v:'↑ 18%',l:'Users',pos:true},{v:'↓ 3%',l:'Churn',pos:true}].map(({v,l,pos}) => (
          <div key={l} className="svc-analytics-kpi" style={{ background: `${color}10`, borderColor: `${color}25` }}>
            <span style={{ color: pos?'#22c55e':'#ef4444', fontSize: 15, fontWeight: 800 }}>{v}</span>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>{l}</span>
          </div>
        ))}
      </div>
      <div className="svc-analytics-charts">
        <div className="svc-analytics-bar-wrap" style={{ background: `${color}08`, borderColor: `${color}18` }}>
          <div className="svc-bar-chart">
            {[55,70,48,85,62,95,72,60,88,75].map((h, i) => (
              <div key={i} className="svc-bar" style={{ height: `${h}%`, background: i===5?color:`${color}35`, borderRadius: 3 }} />
            ))}
          </div>
        </div>
        <div className="svc-analytics-line-wrap" style={{ background: `${color}08`, borderColor: `${color}18` }}>
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id={gradId2} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d="M0,50 C25,42 50,28 75,30 C100,32 125,14 150,16 C175,18 190,8 200,5 L200,60 L0,60Z" fill={`url(#${gradId2})`} />
            <path d="M0,50 C25,42 50,28 75,30 C100,32 125,14 150,16 C175,18 190,8 200,5" fill="none" stroke={color} strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="svc-analytics-insight" style={{ background: `${color}12`, borderColor: `${color}30` }}>
        <span style={{ fontSize: 14 }}>💡</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
          <span style={{ color }}>AI Insight:</span> Revenue up 24% — driven by enterprise segment. Recommend upsell campaign this quarter.
        </span>
      </div>
    </div>
  );
};

const WorkflowVisual = ({ color }: { color: string }) => (
  <div className="svc-visual svc-visual-workflow">
    <svg className="svc-workflow-svg" viewBox="0 0 400 240">
      {/* Trigger → Agent */}
      <line x1="80" y1="60" x2="160" y2="60" stroke={color} strokeOpacity="0.3" strokeWidth="1.5" markerEnd="url(#arrow)" />
      {/* Agent → Decision */}
      <line x1="240" y1="60" x2="310" y2="60" stroke={color} strokeOpacity="0.3" strokeWidth="1.5" />
      {/* Decision → Action A */}
      <line x1="330" y1="80" x2="310" y2="140" stroke={color} strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Decision → Action B */}
      <line x1="330" y1="80" x2="350" y2="140" stroke={color} strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Action A → Complete */}
      <line x1="310" y1="165" x2="295" y2="195" stroke={color} strokeOpacity="0.2" strokeWidth="1.5" />
      {/* Action B → Complete */}
      <line x1="350" y1="165" x2="365" y2="195" stroke={color} strokeOpacity="0.2" strokeWidth="1.5" />

      {/* Trigger node */}
      <rect x="20" y="40" width="60" height="40" rx="8" fill={`${color}12`} stroke={color} strokeOpacity="0.4" />
      <text x="50" y="57" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="inherit">📥</text>
      <text x="50" y="72" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="inherit">Trigger</text>

      {/* AI Agent node */}
      <rect x="160" y="35" width="80" height="50" rx="10" fill={`${color}28`} stroke={color} strokeOpacity="0.8" strokeWidth="1.5" />
      <text x="200" y="55" textAnchor="middle" fill={color} fontSize="9" fontWeight="700" fontFamily="inherit">🤖 AI Agent</text>
      <text x="200" y="70" textAnchor="middle" fill={`${color}cc`} fontSize="8" fontFamily="inherit">Understands intent</text>
      <text x="200" y="82" textAnchor="middle" fill={`${color}cc`} fontSize="8" fontFamily="inherit">& routes action</text>

      {/* Decision diamond */}
      <polygon points="330,42 355,62 330,82 305,62" fill={`${color}15`} stroke={color} strokeOpacity="0.5" />
      <text x="330" y="59" textAnchor="middle" fill={color} fontSize="8" fontWeight="700" fontFamily="inherit">Route</text>
      <text x="330" y="70" textAnchor="middle" fill={color} fontSize="8" fontFamily="inherit">?</text>

      {/* Action A */}
      <rect x="285" y="140" width="55" height="35" rx="7" fill={`${color}10`} stroke={color} strokeOpacity="0.3" />
      <text x="312" y="154" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="8" fontFamily="inherit">⚡ Notify</text>
      <text x="312" y="166" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="inherit">Slack / Email</text>

      {/* Action B */}
      <rect x="350" y="140" width="55" height="35" rx="7" fill={`${color}10`} stroke={color} strokeOpacity="0.3" />
      <text x="377" y="154" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="8" fontFamily="inherit">📋 Create</text>
      <text x="377" y="166" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="inherit">Jira ticket</text>

      {/* Complete */}
      <rect x="300" y="195" width="155" height="30" rx="7" fill={`${color}18`} stroke={color} strokeOpacity="0.5" />
      <text x="377" y="215" textAnchor="middle" fill={color} fontSize="9" fontWeight="700" fontFamily="inherit">✅ Workflow Complete</text>
    </svg>
    <div className="svc-auto-stats" style={{ paddingTop: 0 }}>
      {[{v:'10k+',l:'Runs/day'},{v:'24/7',l:'Active'},{v:'-80%',l:'Manual work'}].map(({v,l}) => (
        <div key={l} className="svc-auto-stat" style={{ background: `${color}0e`, borderColor: `${color}22` }}>
          <span style={{ color, fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{v}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 3 }}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

const ImageVisual = ({ imageUrl, videoUrl, title, color }: { imageUrl: string; videoUrl?: string; title: string; color: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl]);

  return (
    <div className="svc-visual svc-image-visual" style={{ boxShadow: `0 0 60px ${color}20` }}>
      <div className="svc-image-frame" style={{ borderColor: `${color}30` }}>
        {videoUrl
          ? <video ref={videoRef} src={videoUrl} muted loop playsInline autoPlay className="svc-image-media" />
          : <img src={imageUrl} alt={title} className="svc-image-media" />
        }
        <div className="svc-image-overlay" style={{ background: `linear-gradient(to top, ${color}18 0%, transparent 60%)` }} />
      </div>
      <div className="svc-float-badge" style={{ background: `${color}18`, borderColor: `${color}40`, bottom: '6%', right: '4%' }}>
        <span className="svc-badge-dot" style={{ background: color }} />
        <span style={{ color }}>Live Preview</span>
      </div>
    </div>
  );
};

type VisualFC = ({ color }: { color: string }) => React.ReactElement;

const visualMap: Record<string, VisualFC> = {
  roadmap: RoadmapVisual, team: TeamVisual, kanban: KanbanVisual, gantt: GanttVisual,
  governance: GovernanceVisual, stakeholder: StakeholderVisual, note2task: Note2TaskVisual,
  mobile: MobileVisual, code: CodeVisual, chatbot: ChatbotVisual,
  voice: VoiceVisual, omnichannel: OmnichannelVisual,
  browser: BrowserVisual, metrics: MetricsVisual,
  neural: NeuralVisual, automation: AutomationVisual,
  jira: JiraVisual, analytics: AnalyticsVisual, workflow: WorkflowVisual,
};

const SERVICES = ['PM Advisory', 'App Development', 'Web Development', 'AI Consulting'];

const textVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? -36 : 36, y: 8 }),
  center: { opacity: 1, x: 0, y: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 36 : -36, y: -8 }),
};

const visualVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 55 : -55, scale: 0.96 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -55 : 55, scale: 0.96 }),
};

export default function ServicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection]     = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = slides[activeIndex];
  const VisualComponent = visualMap[current.visualType];

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setActiveIndex(idx);
  }, []);

  const goToNext = useCallback(() => goTo((activeIndex + 1) % slides.length, 1),  [activeIndex, goTo]);
  const goToPrev = useCallback(() => goTo((activeIndex - 1 + slides.length) % slides.length, -1), [activeIndex, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goToNext, SLIDE_INTERVAL);
  }, [goToNext]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const nav = (fn: () => void) => { fn(); resetTimer(); };

  return (
    <section className="svc-section">
      <div className="svc-orb svc-orb-a" style={{ background: `radial-gradient(ellipse,${current.accentColor}18 0%,transparent 70%)` }} />
      <div className="svc-orb svc-orb-b" style={{ background: `radial-gradient(ellipse,${current.accentColor}0c 0%,transparent 70%)` }} />

      <div className="svc-inner">

        <div className="svc-tabs" role="tablist">
          {SERVICES.map((svc) => {
            const firstIdx  = slides.findIndex(s => s.service === svc);
            const isActive  = current.service === svc;
            const accentCol = slides.find(s => s.service === svc)!.accentColor;
            return (
              <button key={svc} role="tab" aria-selected={isActive}
                className={`svc-tab${isActive ? ' svc-tab-active' : ''}`}
                style={isActive ? { borderColor: accentCol, color: accentCol } : {}}
                onClick={() => nav(() => goTo(firstIdx, firstIdx > activeIndex ? 1 : -1))}>
                {isActive && <span className="svc-tab-pip" style={{ background: accentCol }} />}
                {svc}
              </button>
            );
          })}
        </div>

        <div className="svc-content">

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={`text-${activeIndex}`} className="svc-text-panel"
              custom={direction} variants={textVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}>
              <div className="svc-tag" style={{ background: `${current.accentColor}18`, borderColor: `${current.accentColor}35`, color: current.accentColor }}>
                <span className="svc-tag-pip" style={{ background: current.accentColor }} />
                {current.tagline}
              </div>
              <h2 className="svc-title">{current.title}</h2>
              <p className="svc-desc">{current.description}</p>
              <ul className="svc-features">
                {current.features.map((f) => (
                  <li key={f} className="svc-feature">
                    <span className="svc-check-wrap" style={{ background: `${current.accentColor}18`, borderColor: `${current.accentColor}35` }}>
                      <Check size={11} color={current.accentColor} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="svc-cta-btn" style={{ background: current.accentGradient }}>
                {current.ctaText} <ArrowRight size={15} />
              </button>
            </motion.div>
          </AnimatePresence>

          <div className="svc-visual-panel">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={`visual-${activeIndex}`} className="svc-visual-wrap"
                custom={direction} variants={visualVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.48, ease: [0.32, 0.72, 0, 1] }}>
                {current.imageUrl
                  ? <ImageVisual imageUrl={current.imageUrl} videoUrl={current.videoUrl} title={current.title} color={current.accentColor} />
                  : VisualComponent && <VisualComponent color={current.accentColor} />
                }
              </motion.div>
            </AnimatePresence>

            <div className="svc-dots">
              {slides.filter(s => s.service === current.service).map((s) => {
                const idx = slides.findIndex(sl => sl.id === s.id);
                const active = idx === activeIndex;
                return (
                  <button key={s.id}
                    className={`svc-dot${active ? ' svc-dot-active' : ''}`}
                    style={active ? { background: current.accentColor, boxShadow: `0 0 8px ${current.accentColor}` } : {}}
                    onClick={() => nav(() => goTo(idx, idx > activeIndex ? 1 : -1))}
                    aria-label={`Slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="svc-nav-row">
          <div className="svc-progress-track">
            <motion.div key={activeIndex} className="svc-progress-fill"
              style={{ background: current.accentColor }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }} />
          </div>
          <div className="svc-nav-controls">
            <span className="svc-slide-count">
              {String(activeIndex + 1).padStart(2, '0')} <span>/ {String(slides.length).padStart(2, '0')}</span>
            </span>
            <div className="svc-arrow-group">
              <button className="svc-arrow-btn" onClick={() => nav(goToPrev)} aria-label="Previous"><ChevronLeft size={20} /></button>
              <button className="svc-arrow-btn" onClick={() => nav(goToNext)} aria-label="Next"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
