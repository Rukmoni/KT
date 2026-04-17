import { useState } from 'react';
import { Check, X, TriangleAlert as AlertTriangle, Clock, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { SeoCheck } from './types';
import { updateCheckStatus } from './seoData';

const STATUS_ICON = {
  pass: <Check size={14} />,
  fail: <X size={14} />,
  warning: <AlertTriangle size={14} />,
  pending: <Clock size={14} />,
};

const STATUS_CLASS: Record<SeoCheck['status'], string> = {
  pass: 'seo-check--pass',
  fail: 'seo-check--fail',
  warning: 'seo-check--warning',
  pending: 'seo-check--pending',
};

const TYPE_LABELS: Record<SeoCheck['check_type'], string> = {
  technical: 'Technical',
  content: 'Content',
  performance: 'Performance',
  'structured-data': 'Schema',
  'ai-seo': 'AI Search',
  local: 'Local',
};

interface Props {
  checks: SeoCheck[];
  onRefresh: () => void;
}

export const SeoChecksPanel = ({ checks, onRefresh }: Props) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const pass = checks.filter(c => c.status === 'pass').length;
  const fail = checks.filter(c => c.status === 'fail').length;
  const warning = checks.filter(c => c.status === 'warning').length;
  const pending = checks.filter(c => c.status === 'pending').length;
  const score = checks.length > 0 ? Math.round((pass / checks.length) * 100) : 0;

  const types = ['all', ...Array.from(new Set(checks.map(c => c.check_type)))];
  const filtered = filterType === 'all' ? checks : checks.filter(c => c.check_type === filterType);

  const cycle = async (check: SeoCheck) => {
    const next: Record<SeoCheck['status'], SeoCheck['status']> = { pending: 'pass', pass: 'fail', fail: 'warning', warning: 'pending' };
    setUpdating(check.id);
    await updateCheckStatus(check.id, next[check.status]);
    onRefresh();
    setUpdating(null);
  };

  return (
    <div className="seo-panel">
      <div className="seo-panel__header">
        <div>
          <h3 className="seo-panel__title">SEO Validation Checks</h3>
          <p className="seo-panel__sub">Technical audit of all on-page and off-page SEO elements</p>
        </div>
        <div className="seo-checks-score">
          <div className="seo-score-ring" style={{ '--pct': score } as React.CSSProperties}>
            <span className="seo-score-num">{score}%</span>
          </div>
          <div className="seo-score-legend">
            <span className="seo-dot pass" />{pass} pass
            <span className="seo-dot fail" />{fail} fail
            <span className="seo-dot warning" />{warning} warn
            <span className="seo-dot pending" />{pending} pending
          </div>
        </div>
        <button className="seo-icon-btn" onClick={onRefresh} title="Refresh checks">
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="seo-filter-row">
        {types.map(t => (
          <button key={t} className={`seo-filter-btn${filterType === t ? ' active' : ''}`} onClick={() => setFilterType(t)}>
            {t === 'all' ? 'All' : TYPE_LABELS[t as SeoCheck['check_type']] ?? t}
          </button>
        ))}
      </div>

      <div className="seo-checks-list">
        {filtered.map(c => (
          <div key={c.id} className={`seo-check-row ${STATUS_CLASS[c.status]}`}>
            <div className="seo-check-row__main">
              <span className="seo-check-status-icon">{STATUS_ICON[c.status]}</span>
              <div className="seo-check-info">
                <span className="seo-check-name">{c.check_name}</span>
                <span className="seo-check-type-badge">{TYPE_LABELS[c.check_type]}</span>
              </div>
              <div className="seo-check-actions">
                <button className="seo-icon-btn seo-icon-btn--sm" onClick={() => cycle(c)} disabled={updating === c.id} title="Toggle status">
                  {updating === c.id ? <RefreshCw size={12} className="spin" /> : <RefreshCw size={12} />}
                </button>
                <button className="seo-icon-btn seo-icon-btn--sm" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                  {expanded === c.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
            </div>
            {expanded === c.id && c.detail && (
              <div className="seo-check-detail">{c.detail}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
