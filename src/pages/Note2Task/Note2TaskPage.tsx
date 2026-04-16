import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, RefreshCw, ChevronDown, Copy, Check, TriangleAlert as AlertTriangle, Shield, FileText, ListChecks, GitBranch } from 'lucide-react';
import { SAMPLE_TRANSCRIPTS, mockExtract } from './sampleData';
import type { ExtractionResult, ExtractedTask } from './sampleData';
import { TaskCard } from './TaskCard';
import { JiraPreviewPanel } from './JiraPreviewPanel';
import './Note2TaskPage.css';

type Tab = 'input' | 'summary' | 'tasks' | 'jira';

export const Note2TaskPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('input');
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

  const TABS: { id: Tab; label: string; icon: React.ElementType; disabled?: boolean }[] = [
    { id: 'input', label: 'Transcript', icon: FileText },
    { id: 'summary', label: 'AI Summary', icon: ListChecks, disabled: !result },
    { id: 'tasks', label: 'Draft Tasks', icon: GitBranch, disabled: !result },
    { id: 'jira', label: 'Jira Preview', icon: Shield, disabled: !result },
  ];

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
    setTab('summary');
  };

  const handleReset = () => {
    setTranscript('');
    setResult(null);
    setTasks([]);
    setSynced(false);
    setTab('input');
    setSelectedTask(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleLoadSample = (idx: number) => {
    setSelectedSample(idx);
    setTranscript(SAMPLE_TRANSCRIPTS[idx].text);
    setSampleMenuOpen(false);
    setResult(null);
    setTasks([]);
    setTab('input');
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

  const approvedCount = tasks.filter(t => t.status === 'Approved').length;
  const readyCount = tasks.filter(t => t.status === 'Ready').length;

  return (
    <div className="n2t-page">
      <header className="n2t-header">
        <div className="n2t-header__inner">
          <div className="n2t-header__left">
            <button className="n2t-back-btn" onClick={() => navigate('/demos')}>
              <ArrowLeft size={16} />
              Demos
            </button>
            <div className="n2t-header__brand">
              <div className="n2t-header__logo">
                <FileText size={16} color="#2563eb" />
              </div>
              <div>
                <span className="n2t-header__product">Note2Task</span>
                <span className="n2t-header__by">by KuvantaTech</span>
              </div>
              <span className="n2t-header__demo-badge">Demo</span>
            </div>
          </div>
          <div className="n2t-header__right">
            {result && (
              <button className="n2t-btn n2t-btn--ghost" onClick={handleCopyJSON}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            )}
            <button className="n2t-btn n2t-btn--ghost" onClick={handleReset}>
              <RefreshCw size={14} />
              Reset
            </button>
            {result && !synced && (
              <button className="n2t-btn n2t-btn--primary" onClick={handleSync}>
                <Zap size={14} />
                Sync to Jira
              </button>
            )}
            {synced && (
              <div className="n2t-synced-badge">
                <Check size={13} />
                Synced to Jira
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="n2t-tabs-bar">
        <div className="n2t-tabs-bar__inner">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`n2t-tab${tab === t.id ? ' n2t-tab--active' : ''}${t.disabled ? ' n2t-tab--disabled' : ''}`}
                onClick={() => !t.disabled && setTab(t.id)}
                disabled={t.disabled}
              >
                <Icon size={14} />
                {t.label}
                {t.id === 'tasks' && tasks.length > 0 && (
                  <span className="n2t-tab__count">{tasks.length}</span>
                )}
              </button>
            );
          })}
        </div>
        {result && (
          <div className="n2t-tabs-bar__meta">
            <span className="n2t-status-chip n2t-status-chip--approved">{approvedCount} Approved</span>
            <span className="n2t-status-chip n2t-status-chip--draft">{tasks.length - approvedCount - readyCount} Draft</span>
          </div>
        )}
      </div>

      <div className="n2t-body">
        <AnimatePresence mode="wait">

          {tab === 'input' && (
            <motion.div
              key="input"
              className="n2t-input-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="n2t-input-panel__toolbar">
                <div className="n2t-input-panel__toolbar-left">
                  <div className="n2t-sample-menu">
                    <button className="n2t-btn n2t-btn--ghost" onClick={() => setSampleMenuOpen(o => !o)}>
                      Load Sample
                      <ChevronDown size={13} />
                    </button>
                    {sampleMenuOpen && (
                      <div className="n2t-sample-dropdown">
                        {SAMPLE_TRANSCRIPTS.map((s, i) => (
                          <button key={i} className={`n2t-sample-item${selectedSample === i ? ' n2t-sample-item--active' : ''}`} onClick={() => handleLoadSample(i)}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="n2t-char-count">{transcript.length} chars</span>
                </div>
                <div className="n2t-input-panel__toolbar-right">
                  <button
                    className={`n2t-generate-btn${loading ? ' n2t-generate-btn--loading' : ''}`}
                    onClick={handleGenerate}
                    disabled={loading || !transcript.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="n2t-spinner" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap size={15} />
                        Generate Tasks
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="n2t-textarea-wrap">
                <textarea
                  ref={textareaRef}
                  className="n2t-textarea"
                  value={transcript}
                  onChange={e => setTranscript(e.target.value)}
                  placeholder="Paste your meeting notes, Zoom transcript, or action summary here..."
                  spellCheck={false}
                />
              </div>

              {loading && (
                <div className="n2t-loading-overlay">
                  <div className="n2t-loading-content">
                    <div className="n2t-loading-ring" />
                    <p className="n2t-loading-label">AI is analyzing your transcript...</p>
                    <p className="n2t-loading-sub">Extracting decisions, actions, owners, and priorities</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'summary' && result && (
            <motion.div
              key="summary"
              className="n2t-summary-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="n2t-summary-section">
                <h3 className="n2t-section-title">Meeting Summary</h3>
                <p className="n2t-summary-text">{result.summary}</p>
              </div>

              <div className="n2t-summary-grid">
                <div className="n2t-summary-block">
                  <div className="n2t-summary-block__header">
                    <Check size={14} color="#16a34a" />
                    <span>Key Decisions</span>
                  </div>
                  <ul className="n2t-summary-list">
                    {result.decisions.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>

                <div className="n2t-summary-block">
                  <div className="n2t-summary-block__header">
                    <AlertTriangle size={14} color="#d97706" />
                    <span>Risks</span>
                  </div>
                  <ul className="n2t-summary-list n2t-summary-list--risk">
                    {result.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>

                <div className="n2t-summary-block">
                  <div className="n2t-summary-block__header">
                    <Shield size={14} color="#dc2626" />
                    <span>Blockers</span>
                  </div>
                  <ul className="n2t-summary-list n2t-summary-list--blocker">
                    {result.blockers.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              </div>

              <div className="n2t-summary-actions">
                <button className="n2t-btn n2t-btn--primary" onClick={() => setTab('tasks')}>
                  Review Draft Tasks
                  <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </motion.div>
          )}

          {tab === 'tasks' && result && (
            <motion.div
              key="tasks"
              className="n2t-tasks-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="n2t-tasks-toolbar">
                <span className="n2t-tasks-count">{tasks.length} tasks extracted</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="n2t-btn n2t-btn--ghost" onClick={handleApproveAll}>
                    Approve All
                  </button>
                  <button className="n2t-btn n2t-btn--primary" onClick={() => setTab('jira')}>
                    Preview in Jira
                    <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
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

          {tab === 'jira' && result && (
            <motion.div
              key="jira"
              className="n2t-jira-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <JiraPreviewPanel tasks={tasks} synced={synced} onSync={handleSync} onApproveAll={handleApproveAll} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
