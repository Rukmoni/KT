import { useState } from 'react';
import { MessageSquare, Send, Settings, Brain, Play, LogIn, Search } from 'lucide-react';
import { MOCK_ACTIVITY_LOGS, timeAgo } from '../mockData';
import type { LogType } from '../types';

const LOG_TYPES: { id: LogType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'message', label: 'Messages' },
  { id: 'reply', label: 'Replies' },
  { id: 'integration', label: 'Integration' },
  { id: 'ai_config', label: 'AI Config' },
  { id: 'test', label: 'Tests' },
  { id: 'access', label: 'Access' },
];

const LOG_ICONS: Record<LogType, React.ReactNode> = {
  message: <MessageSquare size={15} />,
  reply: <Send size={15} />,
  integration: <Settings size={15} />,
  ai_config: <Brain size={15} />,
  test: <Play size={15} />,
  access: <LogIn size={15} />,
};

const LOG_COLORS: Record<LogType, string> = {
  message: 'rgba(59,130,246,0.15)',
  reply: 'rgba(45,212,191,0.12)',
  integration: 'rgba(100,116,139,0.15)',
  ai_config: 'rgba(139,92,246,0.15)',
  test: 'rgba(245,158,11,0.12)',
  access: 'rgba(34,197,94,0.12)',
};

const LOG_ICON_COLORS: Record<LogType, string> = {
  message: '#3B82F6',
  reply: '#2DD4BF',
  integration: '#94A3B8',
  ai_config: '#a78bfa',
  test: '#fbbf24',
  access: '#4ade80',
};

export const ActivityLogsView = () => {
  const [filter, setFilter] = useState<LogType | 'all'>('all');
  const [search, setSearch] = useState('');

  const logs = MOCK_ACTIVITY_LOGS.filter(log => {
    if (filter !== 'all' && log.log_type !== filter) return false;
    if (search && !log.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <h1 className="oh-page-title">Activity Logs</h1>
      <p className="oh-page-sub">Full audit trail of all system activity</p>

      <div className="oh-logs-header">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
          <input
            className="oh-logs-search"
            style={{ paddingLeft: 36 }}
            placeholder="Search activity logs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="oh-logs-filter">
          {LOG_TYPES.map(t => (
            <button
              key={t.id}
              className={`oh-logs-filter-btn${filter === t.id ? ' oh-logs-filter-btn--active' : ''}`}
              onClick={() => setFilter(t.id as LogType | 'all')}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="oh-log-list">
        {logs.map(log => (
          <div key={log.id} className="oh-log-item">
            <div
              className="oh-log-item__icon"
              style={{ background: LOG_COLORS[log.log_type as LogType], color: LOG_ICON_COLORS[log.log_type as LogType] }}
            >
              {LOG_ICONS[log.log_type as LogType]}
            </div>
            <div className="oh-log-item__body">
              <div className="oh-log-item__desc">{log.description}</div>
              <div className="oh-log-item__type">{log.log_type.replace('_', ' ')}</div>
            </div>
            <div className="oh-log-item__time">{timeAgo(log.created_at)}</div>
            <span className={`oh-log-status-dot oh-log-status-dot--${log.status}`} title={log.status} />
          </div>
        ))}
        {logs.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
            No log entries match your filter.
          </div>
        )}
      </div>
    </>
  );
};
