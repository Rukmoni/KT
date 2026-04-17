import { useState } from 'react';
import { Check, Bot, Clock, RotateCcw } from 'lucide-react';
import type { SeoAction } from './types';
import { toggleAction } from './seoData';

const PRIORITY_COLOR: Record<SeoAction['priority'], string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#475569',
};

const CATEGORY_LABEL: Record<SeoAction['category'], string> = {
  technical: 'Technical',
  local: 'Local SEO',
  content: 'Content',
  backlinks: 'Backlinks',
  'ai-seo': 'AI Search',
  performance: 'Performance',
};

const FREQ_LABEL: Record<SeoAction['frequency'], string> = {
  'one-time': 'One-time',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

interface Props {
  actions: SeoAction[];
  onRefresh: () => void;
}

export const SeoActionsPanel = ({ actions, onRefresh }: Props) => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [filterFreq, setFilterFreq] = useState<string>('all');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const freqs = ['all', ...Array.from(new Set(actions.map(a => a.frequency)))];
  const cats = ['all', ...Array.from(new Set(actions.map(a => a.category)))];

  const filtered = actions.filter(a => {
    if (!showCompleted && a.is_completed) return false;
    if (filterFreq !== 'all' && a.frequency !== filterFreq) return false;
    if (filterCat !== 'all' && a.category !== filterCat) return false;
    return true;
  });

  const done = actions.filter(a => a.is_completed).length;
  const automatable = actions.filter(a => a.automation_possible && !a.is_completed).length;

  const handleToggle = async (action: SeoAction) => {
    setUpdating(action.id);
    await toggleAction(action.id, !action.is_completed);
    onRefresh();
    setUpdating(null);
  };

  return (
    <div className="seo-panel">
      <div className="seo-panel__header">
        <div>
          <h3 className="seo-panel__title">SEO Action Checklist</h3>
          <p className="seo-panel__sub">{done}/{actions.length} completed &nbsp;·&nbsp; <Bot size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {automatable} automatable remaining</p>
        </div>
        <div className="seo-progress-bar-wrap">
          <div className="seo-progress-bar">
            <div className="seo-progress-fill" style={{ width: `${actions.length ? (done / actions.length) * 100 : 0}%` }} />
          </div>
          <span className="seo-progress-pct">{actions.length ? Math.round((done / actions.length) * 100) : 0}%</span>
        </div>
      </div>

      <div className="seo-filter-row seo-filter-row--stack">
        <div className="seo-filter-group">
          <span className="seo-filter-label">Frequency</span>
          <div className="seo-filter-pills">
            {freqs.map(f => (
              <button key={f} className={`seo-filter-btn${filterFreq === f ? ' active' : ''}`} onClick={() => setFilterFreq(f)}>
                {f === 'all' ? 'All' : FREQ_LABEL[f as SeoAction['frequency']] ?? f}
              </button>
            ))}
          </div>
        </div>
        <div className="seo-filter-group">
          <span className="seo-filter-label">Category</span>
          <div className="seo-filter-pills">
            {cats.map(c => (
              <button key={c} className={`seo-filter-btn${filterCat === c ? ' active' : ''}`} onClick={() => setFilterCat(c)}>
                {c === 'all' ? 'All' : CATEGORY_LABEL[c as SeoAction['category']] ?? c}
              </button>
            ))}
          </div>
        </div>
        <button className={`seo-filter-btn${showCompleted ? ' active' : ''}`} onClick={() => setShowCompleted(s => !s)}>
          <Check size={11} /> Show completed
        </button>
      </div>

      <div className="seo-actions-list">
        {filtered.length === 0 && (
          <p className="seo-empty">No tasks match the current filters.</p>
        )}
        {filtered.map(a => (
          <div key={a.id} className={`seo-action-row${a.is_completed ? ' completed' : ''}`}>
            <button
              className={`seo-action-check${a.is_completed ? ' checked' : ''}`}
              onClick={() => handleToggle(a)}
              disabled={updating === a.id}
            >
              {updating === a.id ? <RotateCcw size={13} className="spin" /> : a.is_completed ? <Check size={13} /> : null}
            </button>
            <div className="seo-action-body">
              <div className="seo-action-top">
                <span className="seo-action-title">{a.title}</span>
                <div className="seo-action-badges">
                  <span className="seo-badge" style={{ background: PRIORITY_COLOR[a.priority] + '22', color: PRIORITY_COLOR[a.priority], border: `1px solid ${PRIORITY_COLOR[a.priority]}44` }}>
                    {a.priority}
                  </span>
                  <span className="seo-badge seo-badge--cat">{CATEGORY_LABEL[a.category]}</span>
                  <span className="seo-badge seo-badge--freq">{FREQ_LABEL[a.frequency]}</span>
                  {a.automation_possible && (
                    <span className="seo-badge seo-badge--auto" title="Can be automated">
                      <Bot size={10} /> Auto
                    </span>
                  )}
                </div>
              </div>
              <p className="seo-action-desc">{a.description}</p>
              {a.due_date && (
                <p className="seo-action-due">
                  <Clock size={11} />
                  Due {new Date(a.due_date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
              {a.completed_at && (
                <p className="seo-action-due seo-action-due--done">
                  <Check size={11} /> Completed {new Date(a.completed_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
