import { useState } from 'react';
import { Search, ChevronRight, SquareCheck as CheckSquare, Clock, Users, Tag } from 'lucide-react';
import { MOCK_MEETINGS, statusColor, statusLabel } from './mockServices';
import type { MeetingRecord } from './mockServices';
import { SAMPLE_TRANSCRIPTS, mockExtract } from './sampleData';
import { TaskCard } from './TaskCard';
import { JiraPreviewPanel } from './JiraPreviewPanel';
import type { ExtractedTask } from './sampleData';

type DetailTab = 'transcript' | 'ai' | 'jira';

export const MeetingsView = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MeetingRecord | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('transcript');
  const [tasks, setTasks] = useState<ExtractedTask[]>([]);
  const [synced, setSynced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ExtractedTask | null>(null);

  const filtered = MOCK_MEETINGS.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.host.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (m: MeetingRecord) => {
    setSelected(m);
    setDetailTab('transcript');
    const idx = m.title.toLowerCase().includes('sprint') ? 0 : 1;
    const result = mockExtract(SAMPLE_TRANSCRIPTS[idx].text);
    setTasks(result.tasks.map(t => ({ ...t })));
    setSynced(m.status === 'slack_notified');
    setSelectedTask(null);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setDetailTab('ai');
  };

  const handleApproveAll = () => {
    setTasks(prev => prev.map(t => ({ ...t, status: 'Approved' as const })));
  };

  const handleSync = async () => {
    setTasks(prev => prev.map(t => ({ ...t, status: 'Approved' as const })));
    await new Promise(r => setTimeout(r, 900));
    setSynced(true);
  };

  const handleUpdateTask = (updated: ExtractedTask) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTask(updated);
  };

  const approvedCount = tasks.filter(t => t.status === 'Approved').length;

  const DETAIL_TABS: { id: DetailTab; label: string }[] = [
    { id: 'transcript', label: 'Transcript' },
    { id: 'ai', label: 'AI Review' },
    { id: 'jira', label: 'Jira Preview' },
  ];

  const sampleText = selected
    ? SAMPLE_TRANSCRIPTS[selected.title.toLowerCase().includes('sprint') ? 0 : 1].text
    : '';

  const mockResult = selected
    ? mockExtract(sampleText)
    : null;

  return (
    <div className="mv-root">
      {!selected ? (
        <>
          <div className="mv-header">
            <div>
              <h2 className="mv-title">All Meetings</h2>
              <p className="mv-sub">{MOCK_MEETINGS.length} meetings processed</p>
            </div>
            <div className="mv-search">
              <Search size={14} color="#475569" />
              <input className="mv-search-input" placeholder="Search meetings…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="mv-table">
            <div className="mv-table__head">
              <span>Meeting</span>
              <span>Status</span>
              <span>Tickets</span>
              <span>Date</span>
              <span></span>
            </div>
            {filtered.map(m => (
              <div key={m.id} className="mv-table__row" onClick={() => handleOpen(m)}>
                <div className="mv-row__meeting">
                  <p className="mv-row__title">{m.title}</p>
                  <div className="mv-row__meta">
                    <Users size={11} />
                    <span>{m.host}</span>
                    <Clock size={11} />
                    <span>{m.duration}m</span>
                    <Tag size={11} />
                    <span>{m.source === 'zoom_webhook' ? 'Zoom' : 'Manual'}</span>
                  </div>
                </div>
                <div>
                  <span className="mv-status-badge" style={{ color: statusColor(m.status), borderColor: statusColor(m.status) + '33', background: statusColor(m.status) + '11' }}>
                    {statusLabel(m.status)}
                  </span>
                </div>
                <div className="mv-jira-count">
                  {m.jiraCount ? (
                    <span className="mv-jira-pill"><CheckSquare size={11} /> {m.jiraCount} tickets</span>
                  ) : (
                    <span className="mv-jira-pending">Pending</span>
                  )}
                </div>
                <div className="mv-date">{new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <div className="mv-chevron"><ChevronRight size={15} color="#334155" /></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mv-detail">
          <div className="mv-detail__header">
            <button className="mv-back" onClick={() => setSelected(null)}>← All Meetings</button>
            <div className="mv-detail__title-row">
              <h2 className="mv-detail__title">{selected.title}</h2>
              <span className="mv-status-badge" style={{ color: statusColor(selected.status), borderColor: statusColor(selected.status) + '33', background: statusColor(selected.status) + '11' }}>
                {statusLabel(selected.status)}
              </span>
            </div>
            <div className="mv-detail__meta">
              <span><Users size={12} /> {selected.host}</span>
              <span><Clock size={12} /> {selected.duration}m</span>
              <span>{selected.attendees.join(', ')}</span>
            </div>
          </div>

          <div className="mv-detail__tabs">
            {DETAIL_TABS.map(t => (
              <button key={t.id} className={`mv-detail__tab${detailTab === t.id ? ' active' : ''}`} onClick={() => setDetailTab(t.id)}>
                {t.label}
                {t.id === 'ai' && tasks.length > 0 && <span className="mv-tab-badge">{tasks.length}</span>}
                {t.id === 'jira' && approvedCount > 0 && <span className="mv-tab-badge mv-tab-badge--green">{approvedCount}</span>}
              </button>
            ))}
            <div className="mv-detail__tab-actions">
              {detailTab === 'transcript' && (
                <button className={`mv-analyze-btn${loading ? ' loading' : ''}`} onClick={handleAnalyze} disabled={loading}>
                  {loading ? <><span className="n2t-spinner" />Analyzing…</> : 'Run AI Analysis'}
                </button>
              )}
              {detailTab === 'ai' && (
                <button className="mv-analyze-btn" onClick={() => setDetailTab('jira')}>Preview Jira →</button>
              )}
              {detailTab === 'jira' && !synced && (
                <button className="mv-analyze-btn" onClick={handleSync}>Sync to Jira</button>
              )}
            </div>
          </div>

          <div className="mv-detail__body">
            {detailTab === 'transcript' && (
              <div className="mv-transcript">{sampleText}</div>
            )}

            {detailTab === 'ai' && mockResult && (
              <div className="mv-ai-view">
                <div className="mv-ai__summary">
                  <p className="mv-ai__label">Meeting Summary</p>
                  <p className="mv-ai__text">{mockResult.summary}</p>
                </div>
                <div className="mv-ai__grid">
                  <AiBlock title="Key Decisions" items={mockResult.decisions} color="#22c55e" />
                  <AiBlock title="Risks" items={mockResult.risks} color="#f97316" />
                  <AiBlock title="Blockers" items={mockResult.blockers} color="#ef4444" />
                </div>
                <div className="mv-tasks-header">
                  <span>{tasks.length} extracted tasks</span>
                  <button className="mv-ghost-btn" onClick={handleApproveAll}>Approve All</button>
                </div>
                <div className="mv-tasks-list">
                  {tasks.map((task, i) => (
                    <TaskCard key={task.id} task={task} index={i}
                      isSelected={selectedTask?.id === task.id}
                      onSelect={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                      onUpdate={handleUpdateTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {detailTab === 'jira' && (
              <JiraPreviewPanel tasks={tasks} synced={synced} onSync={handleSync} onApproveAll={handleApproveAll} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AiBlock = ({ title, items, color }: { title: string; items: string[]; color: string }) => (
  <div className="mv-ai-block">
    <p className="mv-ai-block__title" style={{ color }}>{title}</p>
    <ul className="mv-ai-block__list">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  </div>
);
