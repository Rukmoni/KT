import { useState, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, MessageSquare, SquareCheck as CheckSquare, Hash, Share2, Search, Zap, RefreshCw, ChevronDown, Copy, Check, TriangleAlert as AlertTriangle, FileText, ArrowRight, ChevronRight, TrendingUp, X, FlaskConical } from 'lucide-react';
import { SAMPLE_TRANSCRIPTS, mockExtract } from './sampleData';
import type { ExtractionResult, ExtractedTask } from './sampleData';
import { TaskCard } from './TaskCard';
import { JiraPreviewPanel } from './JiraPreviewPanel';
import { ConnectionsView } from './ConnectionsView';
import { MeetingsView } from './MeetingsView';
import { WorkflowTestView } from './WorkflowTestView';
import { MOCK_AUDIT } from './mockServices';
import './Note2TaskPage.css';

type View = 'dashboard' | 'new-sync' | 'meetings' | 'jira' | 'slack' | 'connections' | 'workflow-test';
type SyncStep = 'input' | 'summary' | 'tasks' | 'jira-preview';

const RECENT_MEETINGS = [
  { name: 'Q4 Sprint Architecture Review', date: 'Oct 24, 2023', duration: '45m', transcript: 'READY', aiReview: 100, status: 'Review Summary' },
  { name: 'Internal Security Audit Sync', date: 'Oct 23, 2023', duration: '1h 12m', transcript: 'READY', aiReview: 60, status: 'Processing', action: 'Abort Sync' },
  { name: 'Design Feedback: Mobile UX', date: 'Oct 23, 2023', duration: '22m', transcript: 'READY', aiReview: 100, status: 'Review Summary' },
  { name: 'Client Delivery Review — RetailEdge', date: 'Oct 22, 2023', duration: '58m', transcript: 'READY', aiReview: 100, status: 'Review Summary' },
  { name: 'Sprint 4 Planning Session', date: 'Oct 21, 2023', duration: '1h 5m', transcript: 'READY', aiReview: 100, status: 'Review Summary' },
];

const WORKFLOW_STEPS = [
  { icon: '📹', label: 'ZOOM', sub: 'Transcript Ingest' },
  { icon: '🤖', label: 'AI REVIEW', sub: 'Task Extraction', active: true },
  { icon: '📋', label: 'JIRA', sub: 'Ticket Generation' },
  { icon: '💬', label: 'SLACK', sub: 'Team Notification' },
];

export const Note2TaskPage = () => {
  const [view, setView] = useState<View>('dashboard');
  const [syncStep, setSyncStep] = useState<SyncStep>('input');
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPTS[0].text);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [tasks, setTasks] = useState<ExtractedTask[]>([]);
  const [selectedSample, setSelectedSample] = useState(0);
  const [sampleMenuOpen, setSampleMenuOpen] = useState(false);
  const [synced, setSynced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ExtractedTask | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setResult(null);
    setSynced(false);
    setSelectedTask(null);
    await new Promise(r => setTimeout(r, 2200));
    const extracted = mockExtract(transcript);
    setResult(extracted);
    setTasks(extracted.tasks.map(t => ({ ...t })));
    setLoading(false);
    setSyncStep('summary');
  };

  const handleReset = () => {
    setTranscript(SAMPLE_TRANSCRIPTS[0].text);
    setResult(null);
    setTasks([]);
    setSynced(false);
    setSyncStep('input');
    setSelectedTask(null);
  };

  const handleLoadSample = (idx: number) => {
    setSelectedSample(idx);
    setTranscript(SAMPLE_TRANSCRIPTS[idx].text);
    setSampleMenuOpen(false);
    setResult(null);
    setTasks([]);
    setSyncStep('input');
    setSynced(false);
  };

  const handleApproveAll = () => {
    setTasks(prev => prev.map(t => ({ ...t, status: 'Approved' as const })));
  };

  const handleSync = async () => {
    setTasks(prev => prev.map(t => ({ ...t, status: 'Approved' as const })));
    await new Promise(r => setTimeout(r, 900));
    setSynced(true);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(tasks, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateTask = (updated: ExtractedTask) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTask(updated);
  };

  const handleStartNewSync = () => {
    setView('new-sync');
    setSyncStep('input');
    setResult(null);
    setTasks([]);
    setSynced(false);
  };

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const approvedCount = tasks.filter(t => t.status === 'Approved').length;
  const readyCount = tasks.filter(t => t.status === 'Ready').length;

  const navItems: { id: View; icon: React.ElementType; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'meetings', icon: MessageSquare, label: 'Meetings' },
    { id: 'jira', icon: CheckSquare, label: 'Jira' },
    { id: 'slack', icon: Hash, label: 'Slack' },
    { id: 'connections', icon: Share2, label: 'Connections' },
    { id: 'workflow-test', icon: FlaskConical, label: 'Workflow Test' },
  ];

  const SYNC_STEPS: { id: SyncStep; label: string }[] = [
    { id: 'input', label: 'Transcript' },
    { id: 'summary', label: 'AI Summary' },
    { id: 'tasks', label: 'Draft Tasks' },
    { id: 'jira-preview', label: 'Jira Preview' },
  ];
  const syncStepIdx = SYNC_STEPS.findIndex(s => s.id === syncStep);

  return (
    <div className="n2t-app">
      {/* ── Left Sidebar ── */}
      <aside className="n2t-sidebar">
        <div className="n2t-sidebar__user">
          <div className="n2t-sidebar__avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
          <div>
            <p className="n2t-sidebar__name">Lead Architect</p>
            <p className="n2t-sidebar__role">AI OPERATIONS</p>
          </div>
        </div>

        <nav className="n2t-sidebar__nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`n2t-nav-item${view === item.id || (view === 'new-sync' && item.id === 'dashboard') ? ' n2t-nav-item--active' : ''}`}
                onClick={() => { setView(item.id); }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Column ── */}
      <div className="n2t-main">
        {/* Top Header */}
        <header className="n2t-topbar">
          <div className="n2t-topbar__logo">
            <img src="/kuavanta-logo.png" alt="KUVANTA" className="n2t-topbar__logo-img" />
          </div>
          <div className="n2t-topbar__search">
            <Search size={14} color="#64748b" />
            <input className="n2t-search-input" placeholder="Search architecture..." />
          </div>
          <div className="n2t-topbar__right">
            <button className={`n2t-topbar-link${view === 'dashboard' ? ' n2t-topbar-link--active' : ''}`} onClick={() => setView('dashboard')}>Dashboard</button>
            <button className="n2t-topbar-link">Architecture</button>
            <button className="n2t-topbar-link">Logs</button>
            <div className="n2t-topbar__user-btn" title="Signed in">LA</div>
            <button className="n2t-topbar__signout" onClick={handleSignOut} title="Sign out">
              <X size={14} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="n2t-content">
          <AnimatePresence mode="wait">

            {/* ── Dashboard View ── */}
            {(view === 'dashboard') && (
              <motion.div key="dashboard" className="n2t-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                {/* Hero */}
                <section className="n2t-hero">
                  <div className="n2t-hero__bg" />
                  <div className="n2t-hero__content">
                    <div className="n2t-hero__badge">WORKFLOW STATUS: ACTIVE</div>
                    <h1 className="n2t-hero__title">
                      Turn meeting<br />
                      transcripts into<br />
                      <em className="n2t-hero__em">delivery-ready</em> Jira<br />
                      tasks.
                    </h1>
                    <p className="n2t-hero__sub">
                      Our AI engine synthesizes natural conversation into structured engineering requirements, automatically syncing across your stack.
                    </p>
                    <div className="n2t-hero__actions">
                      <button className="n2t-hero-cta n2t-hero-cta--primary" onClick={handleStartNewSync}>
                        Start New Sync
                      </button>
                      <button className="n2t-hero-cta n2t-hero-cta--secondary">
                        View Documentation
                      </button>
                    </div>
                  </div>
                </section>

                {/* Workflow Sequence */}
                <section className="n2t-section">
                  <h2 className="n2t-section-heading">Workflow Sequence</h2>
                  <div className="n2t-workflow">
                    {WORKFLOW_STEPS.map((step, i) => (
                      <div key={i} className="n2t-workflow__step-wrap">
                        <div className={`n2t-workflow__step${step.active ? ' n2t-workflow__step--active' : ''}`}>
                          <span className="n2t-workflow__icon">{step.icon}</span>
                          <p className="n2t-workflow__label">{step.label}</p>
                          <p className="n2t-workflow__sub">{step.sub}</p>
                        </div>
                        {i < WORKFLOW_STEPS.length - 1 && (
                          <ChevronRight size={18} color="#334155" className="n2t-workflow__arrow" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Stats + Integrations */}
                <div className="n2t-stats-row">
                  <div className="n2t-stats-col">
                    <div className="n2t-stat-card">
                      <p className="n2t-stat__label">TOTAL PROCESSED</p>
                      <p className="n2t-stat__value">1,284</p>
                      <p className="n2t-stat__delta">
                        <TrendingUp size={11} /> 12% from last month
                      </p>
                    </div>
                    <div className="n2t-stat-card">
                      <p className="n2t-stat__label">JIRA AUTOMATION RATE</p>
                      <p className="n2t-stat__value">94.2%</p>
                      <p className="n2t-stat__note">Active in 8 projects</p>
                    </div>
                  </div>

                  <div className="n2t-integrations">
                    {[
                      { name: 'Zoom', color: '#2D8CFF' },
                      { name: 'Jira', color: '#0052CC' },
                      { name: 'Slack', color: '#E01E5A' },
                    ].map(int => (
                      <div key={int.name} className="n2t-integration-card">
                        <div className="n2t-integration__header">
                          <div className="n2t-integration__icon" style={{ background: int.color }}>
                            {int.name[0]}
                          </div>
                          <p className="n2t-integration__name">{int.name}</p>
                        </div>
                        <div className="n2t-integration__status">
                          <span className="n2t-status-dot" />
                          Connected
                        </div>
                        <button className="n2t-integration__test">Test</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Meetings */}
                <section className="n2t-section">
                  <div className="n2t-section__header">
                    <h2 className="n2t-section-heading">Recent Meetings</h2>
                    <button className="n2t-view-all" onClick={() => setView('meetings')}>View All History <ArrowRight size={13} /></button>
                  </div>
                  <div className="n2t-meetings-table">
                    <div className="n2t-meetings-table__head">
                      <span>MEETING NAME</span>
                      <span>TRANSCRIPT</span>
                      <span>AI REVIEW</span>
                      <span>INTEGRATIONS</span>
                      <span>ACTIONS</span>
                    </div>
                    {RECENT_MEETINGS.map((m, i) => (
                      <div key={i} className="n2t-meetings-table__row">
                        <div>
                          <p className="n2t-meeting__name">{m.name}</p>
                          <p className="n2t-meeting__meta">{m.date} · {m.duration}</p>
                        </div>
                        <div>
                          <span className="n2t-ready-chip">READY</span>
                        </div>
                        <div className="n2t-ai-review">
                          <div className="n2t-ai-bar">
                            <div className="n2t-ai-bar__fill" style={{ width: `${m.aiReview}%` }} />
                          </div>
                          {m.aiReview === 100 ? <span className="n2t-ai-pct">100%</span> : <span className="n2t-ai-processing">Processing</span>}
                        </div>
                        <div className="n2t-integrations-icons">
                          <div className="n2t-int-icon n2t-int-icon--jira">J</div>
                          <div className="n2t-int-icon n2t-int-icon--slack">#</div>
                        </div>
                        <div>
                          <button className="n2t-action-link" onClick={() => { setView('new-sync'); setSyncStep('summary'); setResult(mockExtract(transcript)); setTasks(mockExtract(transcript).tasks.map(t => ({ ...t }))); }}>
                            {m.status}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Audit Log */}
                <section className="n2t-section" style={{ paddingBottom: 32 }}>
                  <div className="n2t-section__header">
                    <h2 className="n2t-section-heading">Recent Audit Log</h2>
                    <button className="n2t-view-all" onClick={() => setView('connections')}>View Connections <ArrowRight size={13} /></button>
                  </div>
                  <div className="n2t-audit-table">
                    {MOCK_AUDIT.map(entry => (
                      <div key={entry.id} className="n2t-audit-row">
                        <span className={`n2t-audit-action n2t-audit-action--${entry.entityType}`}>{entry.action}</span>
                        <span className="n2t-audit-detail">{entry.details}</span>
                        <span className="n2t-audit-time">{new Date(entry.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* ── New Sync / Meetings View ── */}
            {(view === 'new-sync' || view === 'meetings') && (
              <motion.div key="new-sync" className="n2t-sync-view" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                <div className="n2t-sync-header">
                  <div className="n2t-sync-header__left">
                    <button className="n2t-back-link" onClick={() => setView('dashboard')}>
                      ← Dashboard
                    </button>
                    <h2 className="n2t-sync-title">
                      {view === 'meetings' ? 'All Meetings' : 'New Sync'}
                    </h2>
                  </div>
                  <div className="n2t-sync-header__right">
                    {result && (
                      <button className="n2t-action-btn n2t-action-btn--ghost" onClick={handleCopyJSON}>
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? 'Copied' : 'Copy JSON'}
                      </button>
                    )}
                    <button className="n2t-action-btn n2t-action-btn--ghost" onClick={handleReset}>
                      <RefreshCw size={13} />
                      Reset
                    </button>
                    {result && !synced && (
                      <button className="n2t-action-btn n2t-action-btn--primary" onClick={handleSync}>
                        <Zap size={13} />
                        Sync to Jira
                      </button>
                    )}
                    {synced && (
                      <div className="n2t-synced-pill">
                        <Check size={12} /> Synced to Jira
                      </div>
                    )}
                  </div>
                </div>

                {/* Step indicator */}
                <div className="n2t-steps">
                  {SYNC_STEPS.map((s, i) => (
                    <div key={s.id} className="n2t-steps__item">
                      <button
                        className={`n2t-step${syncStep === s.id ? ' n2t-step--active' : ''}${i < syncStepIdx ? ' n2t-step--done' : ''}${!result && i > 0 ? ' n2t-step--locked' : ''}`}
                        onClick={() => { if (result || i === 0) setSyncStep(s.id); }}
                        disabled={!result && i > 0}
                      >
                        <span className="n2t-step__num">{i < syncStepIdx ? <Check size={11} /> : i + 1}</span>
                        {s.label}
                      </button>
                      {i < SYNC_STEPS.length - 1 && <ChevronRight size={14} color="#334155" />}
                    </div>
                  ))}
                  {result && (
                    <div className="n2t-steps__meta">
                      <span className="n2t-chip n2t-chip--green">{approvedCount} Approved</span>
                      <span className="n2t-chip n2t-chip--muted">{tasks.length - approvedCount - readyCount} Draft</span>
                    </div>
                  )}
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait">

                  {syncStep === 'input' && (
                    <motion.div key="input" className="n2t-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <div className="n2t-panel__toolbar">
                        <div className="n2t-sample-menu">
                          <button className="n2t-action-btn n2t-action-btn--ghost" onClick={() => setSampleMenuOpen(o => !o)}>
                            Load Sample <ChevronDown size={12} />
                          </button>
                          {sampleMenuOpen && (
                            <div className="n2t-dropdown">
                              {SAMPLE_TRANSCRIPTS.map((s, i) => (
                                <button key={i} className={`n2t-dropdown__item${selectedSample === i ? ' active' : ''}`} onClick={() => handleLoadSample(i)}>
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="n2t-char-count">{transcript.length} chars</span>
                        <button
                          className={`n2t-generate-btn${loading ? ' loading' : ''}`}
                          onClick={handleGenerate}
                          disabled={loading || !transcript.trim()}
                        >
                          {loading ? <><span className="n2t-spinner" />Analyzing...</> : <><Zap size={14} />Generate Tasks</>}
                        </button>
                      </div>
                      <div className="n2t-panel__body" style={{ position: 'relative' }}>
                        <textarea
                          ref={textareaRef}
                          className="n2t-transcript-area"
                          value={transcript}
                          onChange={e => setTranscript(e.target.value)}
                          placeholder="Paste your meeting notes, Zoom transcript, or action summary here..."
                          spellCheck={false}
                        />
                        {loading && (
                          <div className="n2t-loading-veil">
                            <div className="n2t-loading-ring" />
                            <p className="n2t-loading-label">AI is analyzing your transcript...</p>
                            <p className="n2t-loading-sub">Extracting decisions, actions, owners, and priorities</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {syncStep === 'summary' && result && (
                    <motion.div key="summary" className="n2t-summary-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <div className="n2t-panel">
                        <div className="n2t-panel__label">Meeting Summary</div>
                        <p className="n2t-panel__text">{result.summary}</p>
                      </div>
                      <div className="n2t-summary-grid">
                        <div className="n2t-summary-block">
                          <div className="n2t-summary-block__hd">
                            <Check size={13} color="#22c55e" /> Key Decisions
                          </div>
                          <ul className="n2t-list n2t-list--green">
                            {result.decisions.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                        <div className="n2t-summary-block">
                          <div className="n2t-summary-block__hd">
                            <AlertTriangle size={13} color="#f97316" /> Risks
                          </div>
                          <ul className="n2t-list n2t-list--orange">
                            {result.risks.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                        <div className="n2t-summary-block">
                          <div className="n2t-summary-block__hd">
                            <X size={13} color="#ef4444" /> Blockers
                          </div>
                          <ul className="n2t-list n2t-list--red">
                            {result.blockers.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="n2t-summary-footer">
                        <button className="n2t-action-btn n2t-action-btn--primary" onClick={() => setSyncStep('tasks')}>
                          Review Draft Tasks <ArrowRight size={13} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {syncStep === 'tasks' && result && (
                    <motion.div key="tasks" className="n2t-tasks-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <div className="n2t-tasks-header">
                        <span className="n2t-tasks-count">{tasks.length} tasks extracted</span>
                        <div className="n2t-tasks-actions">
                          <button className="n2t-action-btn n2t-action-btn--ghost" onClick={handleApproveAll}>Approve All</button>
                          <button className="n2t-action-btn n2t-action-btn--primary" onClick={() => setSyncStep('jira-preview')}>
                            Preview in Jira <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="n2t-tasks-list">
                        {tasks.map((task, i) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            index={i}
                            isSelected={selectedTask?.id === task.id}
                            onSelect={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                            onUpdate={handleUpdateTask}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {syncStep === 'jira-preview' && result && (
                    <motion.div key="jira-preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <JiraPreviewPanel tasks={tasks} synced={synced} onSync={handleSync} onApproveAll={handleApproveAll} />
                    </motion.div>
                  )}

                </AnimatePresence>
              </motion.div>
            )}

            {/* ── Meetings view ── */}
            {view === 'meetings' && (
              <motion.div key="meetings" className="n2t-full-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <MeetingsView />
              </motion.div>
            )}

            {/* ── Connections view ── */}
            {view === 'connections' && (
              <motion.div key="connections" className="n2t-full-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <ConnectionsView />
              </motion.div>
            )}

            {/* ── Workflow Test view ── */}
            {view === 'workflow-test' && (
              <motion.div key="workflow-test" className="n2t-full-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <WorkflowTestView />
              </motion.div>
            )}

            {/* ── Placeholder views (Jira, Slack standalone) ── */}
            {(view === 'jira' || view === 'slack') && (
              <motion.div key={view} className="n2t-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="n2t-placeholder__card">
                  <FileText size={32} color="#334155" />
                  <h3>{view === 'jira' ? 'Jira Tickets' : 'Slack Notifications'}</h3>
                  <p>Configure your {view === 'jira' ? 'Jira' : 'Slack'} integration in Connections, then process a meeting to see tickets here.</p>
                  <button className="n2t-action-btn n2t-action-btn--primary" onClick={() => setView('connections')}>
                    Configure Integration
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
