import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, CreditCard as Edit3, Save, X } from 'lucide-react';
import type { SeoKeyword } from './types';
import { updateKeywordPosition } from './seoData';

const COMPETITION_COLOR: Record<SeoKeyword['competition'], string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const INTENT_COLOR: Record<SeoKeyword['intent'], string> = {
  informational: '#60a5fa',
  navigational: '#94a3b8',
  commercial: '#f59e0b',
  transactional: '#22c55e',
};

interface Props {
  keywords: SeoKeyword[];
  onRefresh: () => void;
}

export const SeoKeywordsPanel = ({ keywords, onRefresh }: Props) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [posInput, setPosInput] = useState<string>('');

  const startEdit = (kw: SeoKeyword) => {
    setEditing(kw.id);
    setPosInput(kw.position != null ? String(kw.position) : '');
  };

  const saveEdit = async (kw: SeoKeyword) => {
    const pos = posInput === '' ? null : Number(posInput);
    await updateKeywordPosition(kw.id, pos, kw.position);
    onRefresh();
    setEditing(null);
  };

  const ranked = keywords.filter(k => k.position != null).length;
  const top10 = keywords.filter(k => k.position != null && k.position <= 10).length;
  const totalVolume = keywords.reduce((s, k) => s + k.monthly_volume, 0);

  return (
    <div className="seo-panel">
      <div className="seo-panel__header">
        <div>
          <h3 className="seo-panel__title">Keyword Tracker</h3>
          <p className="seo-panel__sub">{keywords.length} keywords tracked &nbsp;·&nbsp; {ranked} ranking &nbsp;·&nbsp; {top10} in top 10</p>
        </div>
        <div className="seo-kw-stats">
          <div className="seo-kw-stat">
            <span className="seo-kw-stat__num">{totalVolume.toLocaleString()}</span>
            <span className="seo-kw-stat__label">mo. searches</span>
          </div>
          <div className="seo-kw-stat">
            <span className="seo-kw-stat__num">{top10}</span>
            <span className="seo-kw-stat__label">top 10</span>
          </div>
        </div>
      </div>

      <div className="seo-kw-table-wrap">
        <table className="seo-kw-table">
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Position</th>
              <th>Change</th>
              <th>Volume/mo</th>
              <th>Competition</th>
              <th>Intent</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {keywords.map(kw => {
              const delta = kw.previous_position != null && kw.position != null ? kw.previous_position - kw.position : null;
              return (
                <tr key={kw.id}>
                  <td className="seo-kw-keyword">{kw.keyword}</td>
                  <td className="seo-kw-pos">
                    {editing === kw.id ? (
                      <input
                        className="seo-pos-input"
                        type="number"
                        min={1}
                        max={200}
                        value={posInput}
                        onChange={e => setPosInput(e.target.value)}
                        placeholder="—"
                        autoFocus
                      />
                    ) : (
                      <span className={`seo-pos-badge${kw.position != null && kw.position <= 10 ? ' top10' : kw.position != null && kw.position <= 30 ? ' top30' : ''}`}>
                        {kw.position != null ? `#${kw.position}` : '—'}
                      </span>
                    )}
                  </td>
                  <td>
                    {delta != null ? (
                      delta > 0 ? <span className="seo-delta up"><TrendingUp size={12} />+{delta}</span>
                        : delta < 0 ? <span className="seo-delta down"><TrendingDown size={12} />{delta}</span>
                          : <span className="seo-delta flat"><Minus size={12} /></span>
                    ) : <span className="seo-delta flat">—</span>}
                  </td>
                  <td className="seo-kw-vol">{kw.monthly_volume.toLocaleString()}</td>
                  <td>
                    <span className="seo-comp-dot" style={{ background: COMPETITION_COLOR[kw.competition] }} />
                    <span style={{ color: COMPETITION_COLOR[kw.competition], fontSize: '12px' }}>{kw.competition}</span>
                  </td>
                  <td>
                    <span className="seo-intent-tag" style={{ background: INTENT_COLOR[kw.intent] + '20', color: INTENT_COLOR[kw.intent] }}>
                      {kw.intent}
                    </span>
                  </td>
                  <td className="seo-kw-notes">{kw.notes}</td>
                  <td>
                    {editing === kw.id ? (
                      <div className="seo-edit-actions">
                        <button className="seo-icon-btn seo-icon-btn--sm" onClick={() => saveEdit(kw)}><Save size={12} /></button>
                        <button className="seo-icon-btn seo-icon-btn--sm" onClick={() => setEditing(null)}><X size={12} /></button>
                      </div>
                    ) : (
                      <button className="seo-icon-btn seo-icon-btn--sm" onClick={() => startEdit(kw)}><Edit3 size={12} /></button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="seo-kw-tip">
        Click the edit icon to update a keyword's current ranking position. Check rankings monthly using incognito search or Ubersuggest.
      </div>
    </div>
  );
};
