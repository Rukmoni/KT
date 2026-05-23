// ─────────────────────────────────────────────────────────────
// config.ts  —  Single source of truth for portfolio constants
// nagarajan.kuvanta.tech
// ─────────────────────────────────────────────────────────────

// ── 1. PERSONAL IDENTITY ─────────────────────────────────────

export const PERSON = {
  name: "Nagarajan Maheswaran",
  nameShort: "Nagarajan",
  initials: "NM",
  title: "IT Delivery Manager",
  subtitle: "Digital Transformation · Enterprise Programme Leadership",
  tagline:
    "25 years of regulated, high-stakes delivery — from engineering roots to $20M+ portfolio leadership across Telecom, BFSI, and Energy.",
  location: "Kuala Lumpur, Malaysia",
  locationCoords: { lat: 3.139, lng: 101.6869 },
  availability:
    "Open to contract, fractional, and advisory roles — Malaysia & global remote",

  email: "nagarajanm.13@gmail.com",
  phone: "+60 17 331 2231",
  linkedin: "https://www.linkedin.com/in/nagarajanmaheswaran",
  website: "https://kuvanta.tech",
  portfolio: "https://nagarajan.kuvanta.tech",

  headshot: "/nagarajan.png",
  cv: "/nagarajan-cv.pdf",
  ogImage: "/og-image.jpg",
} as const;

// ── 2. SITE META ──────────────────────────────────────────────

export const SITE = {
  url: "https://nagarajan.kuvanta.tech",
  title: "Nagarajan Maheswaran | IT Delivery Manager · PMP® · Kuala Lumpur",
  description:
    "Senior IT Delivery Manager with 25+ years across Telecom, BFSI, and Energy. PMP® · PSM I · CSPO®. Available for contract, fractional, and advisory roles in Malaysia and globally.",
  keywords: [
    "IT Delivery Manager Kuala Lumpur",
    "Project Manager Malaysia",
    "PMP certified Malaysia",
    "SAFe Agile delivery manager",
    "programme manager Malaysia",
    "digital transformation consultant KL",
    "telecom project manager",
    "freelance IT PM Malaysia",
    "contract delivery manager APAC",
    "Kuvanta",
    "Nagarajan Maheswaran",
  ],
  themeColor: "#7C3AED",
  locale: "en_MY",
  twitterHandle: "@kuvantatech",
} as const;

// ── 3. BRAND / DESIGN TOKENS ──────────────────────────────────

export const BRAND = {
  bg: "#0A0A0F",
  surface: "#12121A",
  violet: "#7C3AED",
  violetLight: "#A78BFA",
  cyan: "#06B6D4",
  textPrimary: "#F1F5F9",
  textMuted: "#94A3B8",
  border: "#1E1E2E",
} as const;

// ── 4. METRICS ────────────────────────────────────────────────

export const METRICS = [
  {
    value: 20,
    suffix: "M+",
    prefix: "$",
    label: "Annual Portfolio",
    sublabel: "Governed across M1 Digital Labs & Datacom",
  },
  {
    value: 35,
    suffix: "%",
    prefix: "",
    label: "OTD Improvement",
    sublabel: "M1 Digital Labs · 3-year engagement",
  },
  {
    value: 30,
    suffix: "%",
    prefix: "",
    label: "Velocity Uplift",
    sublabel: "SAFe ART facilitation, 8+ workstreams",
  },
  {
    value: 25,
    suffix: "+",
    prefix: "",
    label: "Years Experience",
    sublabel: "Engineering → Programme Leadership",
  },
] as const;

// ── 5. CERTIFICATIONS ─────────────────────────────────────────

export const CERTS = [
  {
    id: "pmp",
    name: "PMP®",
    full: "Project Management Professional",
    issuer: "Project Management Institute",
    issuerShort: "PMI",
    year: null,
    badgeColor: "#7C3AED",
  },
  {
    id: "psm",
    name: "PSM I",
    full: "Professional Scrum Master",
    issuer: "Scrum.org",
    issuerShort: "Scrum.org",
    year: null,
    badgeColor: "#2563EB",
  },
  {
    id: "cspo",
    name: "CSPO®",
    full: "Certified Scrum Product Owner",
    issuer: "Scrum Alliance",
    issuerShort: "Scrum Alliance",
    year: null,
    badgeColor: "#16A34A",
  },
  {
    id: "pmi-genai",
    name: "PMI GenAI",
    full: "Generative AI in Practice",
    issuer: "Project Management Institute",
    issuerShort: "PMI",
    year: 2025,
    badgeColor: "#D97706",
  },
  {
    id: "ibm-aipm",
    name: "IBM AI PM",
    full: "AI Product Manager",
    issuer: "IBM / Coursera",
    issuerShort: "IBM",
    year: 2025,
    badgeColor: "#0F172A",
  },
  {
    id: "li-ai",
    name: "AI-First Leader",
    full: "AI-First Product Leader",
    issuer: "LinkedIn Learning",
    issuerShort: "LinkedIn",
    year: 2025,
    badgeColor: "#0A66C2",
  },
] as const;

// ── 6. EXPERIENCE TIMELINE ────────────────────────────────────

export const EXPERIENCE = [
  {
    id: "kuvanta",
    role: "Founder & Principal Consultant",
    company: "Kuvanta Tech",
    location: "Kuala Lumpur (Remote)",
    period: "Sep 2025 – Present",
    sector: "Advisory",
    sectorColor: "#7C3AED",
    current: true,
    achievements: [
      "3 paid advisory engagements — enterprise PM rigour applied to scaling technology and product teams",
      "Completed PMI GenAI, IBM AI Product Manager, and AI-First Product Leader certifications",
      "Building AI-assisted delivery frameworks and consulting toolkits for Kuvanta clients",
    ],
    url: "https://kuvanta.tech",
  },
  {
    id: "m1",
    role: "Senior IT Project Manager / Delivery Manager",
    company: "M1 Digital Labs (Keppel Group)",
    location: "Kuala Lumpur",
    period: "Sep 2022 – Aug 2025",
    sector: "Telecom",
    sectorColor: "#0EA5E9",
    current: false,
    achievements: [
      "35% OTD improvement and 30% velocity uplift — SAFe ART facilitation across 8+ concurrent Agile workstreams in a MAS-regulated environment",
      "Zero audit findings over 3 years — RAID governance, Change Control Boards, and release readiness gates across 45+ applications",
      "MAS-regulated payments platform delivered end-to-end — eGIRO, PayNow, Visa, UOB, AXS, DBS — zero billing-cycle failures across all go-lives",
      "MuleSoft-to-microservices migration: multi-million dollar licensing saving with zero service disruption",
    ],
  },
  {
    id: "datacom",
    role: "Project Manager – Cloud & Transformation Delivery",
    company: "Datacom Systems Asia Sdn Bhd",
    location: "Kuala Lumpur",
    period: "Apr 2016 – Aug 2022",
    sector: "Multi-sector",
    sectorColor: "#10B981",
    current: false,
    achievements: [
      "$18M+ annual portfolio — CRM, cloud migration, application modernisation across Telco, public sector, and enterprise accounts",
      "67% → 90%+ on-time delivery within 18 months — Agile delivery governance built from zero across a 12-person team",
      "20% portfolio cost reduction through vendor renegotiation and workstream rationalisation, zero impact to scope or quality",
    ],
  },
  {
    id: "petronas",
    role: "Project Manager – Enterprise Application Delivery",
    company: "Petronas ICT Sdn Bhd",
    location: "Kuala Lumpur",
    period: "Sep 2014 – Oct 2015",
    sector: "Energy",
    sectorColor: "#F59E0B",
    current: false,
    achievements: [
      "ECM, HRMS, BI, e-commerce, and data migration — zero-defect delivery under strict EPMO governance and CAPEX controls",
      "Contributed to USD 1M presales win through business case development; received Focused Recognition Award",
    ],
  },
  {
    id: "tentacle",
    role: "IT Project Manager",
    company: "Tentacle Technologies (M) Sdn Bhd",
    location: "Kuala Lumpur, Malaysia",
    period: "Aug 2013 – Sep 2014",
    sector: "Enterprise",
    sectorColor: "#10B981",
    current: false,
    earlyCareer: false,
    achievements: [
      "Implemented Agile delivery framework from zero within 60 days — improving coordination, sprint predictability, and client satisfaction across all active engagements",
      "Delivered ECM Portal and enterprise application projects on scope, on time, and to quality — establishing repeatable delivery processes that the team continued using after handover",
      "Served as primary client-facing PM across multiple concurrent accounts — managing scope, timelines, and escalations independently",
    ],
  },
  {
    id: "hexacorp",
    role: "Project Manager",
    company: "Hexacorp Technical Services",
    location: "Chennai, India",
    period: "May 2012 – Aug 2013",
    sector: "Enterprise · BFSI",
    sectorColor: "#6366F1",
    current: false,
    earlyCareer: true,
    achievements: [
      "Led a 15-person cross-functional team across SharePoint intranet and CRM programme delivery for American Express, MLS, and DuPont — zero data loss across all client engagements",
      "Delivered full project lifecycle from requirements through UAT, release, and hypercare — managing client relationships directly across three concurrent accounts",
      "Drove quality governance through structured code reviews, defect triage cadences, and milestone reporting to senior stakeholders",
    ],
  },
  {
    id: "virtusa",
    role: "Project Leader",
    company: "Virtusa India Pvt. Ltd",
    client: "Standard Chartered Bank (SCB)",
    location: "Chennai, India",
    period: "Jan 2010 – Dec 2011",
    sector: "BFSI",
    sectorColor: "#0EA5E9",
    current: false,
    earlyCareer: true,
    achievements: [
      "Delivered SCB's global Compliance Portal — regulatory-grade platform supporting compliance workflows across SCB's international operations",
      "Built and delivered the Knowledge Management Framework and GTO Executive Dashboard for SCB's Group Technology Operations — enabling executive-level programme visibility across a distributed global team",
      "Managed onshore-offshore coordination across Chennai and Singapore delivery teams under strict banking-grade change control and audit protocols",
    ],
  },
  {
    id: "mphasis",
    role: "Project Leader",
    company: "Mphasis Fin Solutions (AIG Systems Solutions)",
    client: "AIG — American International Group",
    location: "Chennai, India",
    period: "Dec 2006 – Jan 2010",
    sector: "BFSI · Insurance",
    sectorColor: "#F59E0B",
    current: false,
    earlyCareer: true,
    achievements: [
      "Delivered AIG IntelliRisk — an enterprise risk management platform supporting AIG's global risk and underwriting operations across multiple lines of business",
      "Led a legacy COBOL-to-.NET/SQL Server migration covering 150,000+ insurance policies — 30% cost reduction achieved, full regulatory compliance maintained, zero data integrity failures",
      "Managed a 12-person cross-functional team across analysis, development, testing, and release — coordinating with AIG's global stakeholders across US and APAC time zones",
      "Delivered under strict insurance-industry audit and compliance controls — all deliverables passed internal and external regulatory review without findings",
    ],
  },
  {
    id: "engineering",
    role: "Senior Software Engineer → Technical Lead",
    company: "Engineering Foundation (2000–2006)",
    companies: [
      { name: "Nanocube Software", location: "Chennai", period: "2004–2006" },
      { name: "Ragas Info Solutions", location: "Chennai", period: "2002–2004" },
      { name: "Proton Web Solutions", location: "Chennai", period: "2000–2002" },
    ],
    location: "Chennai, India",
    period: "2000 – 2006",
    sector: "Engineering Foundation",
    sectorColor: "#475569",
    current: false,
    earlyCareer: true,
    isFoundation: true,
    prose: "Six years of full-stack development across security platforms, CRM systems, payments infrastructure, and enterprise web applications. Progressed from junior engineer to technical lead — building the architecture intuition, code-level credibility, and systems thinking that now underpins every delivery governance and integration risk decision made at programme level.",
    subheading: "The technical bedrock behind 25 years of delivery leadership.",
    techTags: [".NET", "ASP.NET", "SQL Server", "COBOL", "Java", "VB", "Oracle", "IIS", "COM+", "Crystal Reports"],
    achievements: [],
  },
] as const;

// ── 7. ADVISORY SERVICES ─────────────────────────────────────

export const SERVICES = [
  {
    id: "rescue",
    title: "Programme Rescue & Recovery",
    icon: "ShieldAlert",
    description:
      "Immediate-impact intervention for late-stage or at-risk programmes. Rapid governance reset, re-planning, stakeholder realignment, and structured recovery roadmap.",
    tags: ["RAID Reset", "Re-baseline", "Stakeholder Repair"],
  },
  {
    id: "safe",
    title: "Agile Transformation & SAFe Coaching",
    icon: "RefreshCw",
    description:
      "SAFe ART setup, PI Planning facilitation, sprint governance, backlog health — from zero to scaled. Built on real delivery, not certification theory.",
    tags: ["SAFe ART", "PI Planning", "Sprint Coaching"],
  },
  {
    id: "ai",
    title: "AI-Augmented Delivery Consulting",
    icon: "Cpu",
    description:
      "Applying GenAI tools and AI-assisted delivery frameworks to accelerate enterprise programme outcomes — scoping, risk modelling, reporting, and stakeholder artefacts.",
    tags: ["GenAI Tools", "AI Delivery", "PMO Automation"],
  },
  {
    id: "fractional",
    title: "Fractional Delivery Manager",
    icon: "Users",
    description:
      "Embedded part-time Delivery Manager for product and engineering teams that need senior PM coverage without a full-time hire. Retainer or time-and-materials.",
    tags: ["Fractional PM", "Retainer", "Embedded"],
  },
] as const;

// ── 8. NAVIGATION ─────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
] as const;

// ── 9. SOCIAL LINKS ───────────────────────────────────────────

export const SOCIAL = [
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/nagarajanmaheswaran",
    icon: "Linkedin",
  },
  {
    id: "email",
    label: "Email",
    url: "mailto:nagarajanm.13@gmail.com",
    icon: "Mail",
  },
  {
    id: "website",
    label: "Kuvanta",
    url: "https://kuvanta.tech",
    icon: "Globe",
  },
] as const;
