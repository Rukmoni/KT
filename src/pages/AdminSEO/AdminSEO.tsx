import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, Clock, ChartBar as BarChart2, List, SquareCheck as CheckSquare, BookOpen } from 'lucide-react';
import type { SeoKeyword, SeoAction, SeoCheck } from './types';
import { fetchKeywords, fetchActions, fetchChecks } from './seoData';
import { SeoChecksPanel } from './SeoChecksPanel';
import { SeoActionsPanel } from './SeoActionsPanel';
import { SeoKeywordsPanel } from './SeoKeywordsPanel';
import { SeoGuidancePanel } from './SeoGuidancePanel';
import './AdminSEO.css';

type View = 'checks' | 'actions' | 'keywords' | 'guidance';

export const AdminSEO = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('checks');
  const [keywords, setKeywords] = useState<SeoKeyword[]>([]);
  const [actions, setActions] = useState<SeoAction[]>([]);
  const [checks, setChecks] = useState<SeoCheck[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [kw, ac, ch] = await Promise.all([fetchKeywords(), fetchActions(), fetchChecks()]);
    setKeywords(kw);
    setActions(ac);
    setChecks(ch);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const passCount = checks.filter(c => c.status === 'pass').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warning').length;
  const pendingCount = checks.filter(c => c.status === 'pending').length;
  const doneActions = actions.filter(a => a.is_completed).length;
  const critical = actions.filter(a => a.priority === 'critical' && !a.is_completed).length;

  const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'checks', label: 'SEO Checks', icon: <CheckCircle size={14} /> },
    { id: 'actions', label: 'Action Checklist', icon: <CheckSquare size={14} /> },
    { id: 'keywords', label: 'Keywords', icon: <BarChart2 size={14} /> },
    { id: 'guidance', label: 'Action Guide', icon: <BookOpen size={14} /> },
  ];

  const ADMIN_TABS = [
    { label: 'Sales & Leads', path: '/admin' },
    { label: 'Note2Task Credentials', path: '/admin/note2task' },
    { label: 'SEO Dashboard', path: '/admin/seo' },
  ];

  return (
    <div className="seo-root">
      <div className="seo-shell">
        <div className="seo-top-tabs">
          {ADMIN_TABS.map(t => (
            <button
              key={t.path}
              className={`seo-top-tab${t.path === '/admin/seo' ? ' active' : ''}`}
              onClick={() => navigate(t.path)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="seo-header">
          <div>
            <h1 className="seo-title">SEO Dashboard</h1>
            <p className="seo-sub">Track, validate, and action everything needed to rank kuvanta.tech at the top of Google, Bing, and AI search.</p>
          </div>
        </div>

        <div className="seo-summary-row">
          <div className={`seo-summary-card seo-summary-card--${failCount > 0 ? 'fail' : 'pass'}`}>
            {failCount > 0 ? <XCircle size={18} /> : <CheckCircle size={18} />}
            <div>
              <p className="seo-summary-num">{failCount}</p>
              <p className="seo-summary-label">Failed checks</p>
            </div>
          </div>
          <div className={`seo-summary-card seo-summary-card--${warnCount > 0 ? 'warn' : 'pass'}`}>
            <AlertCircle size={18} />
            <div>
              <p className="seo-summary-num">{warnCount}</p>
              <p className="seo-summary-label">Warnings</p>
            </div>
          </div>
          <div className={`seo-summary-card seo-summary-card--${critical > 0 ? 'fail' : 'pass'}`}>
            <List size={18} />
            <div>
              <p className="seo-summary-num">{critical}</p>
              <p className="seo-summary-label">Critical actions pending</p>
            </div>
          </div>
          <div className="seo-summary-card seo-summary-card--pass">
            <CheckCircle size={18} />
            <div>
              <p className="seo-summary-num">{passCount}</p>
              <p className="seo-summary-label">Checks passing</p>
            </div>
          </div>
          <div className="seo-summary-card seo-summary-card--neutral">
            <Clock size={18} />
            <div>
              <p className="seo-summary-num">{pendingCount}</p>
              <p className="seo-summary-label">Pending verification</p>
            </div>
          </div>
          <div className="seo-summary-card seo-summary-card--neutral">
            <CheckSquare size={18} />
            <div>
              <p className="seo-summary-num">{doneActions}/{actions.length}</p>
              <p className="seo-summary-label">Actions done</p>
            </div>
          </div>
        </div>

        <div className="seo-nav">
          {NAV_ITEMS.map(n => (
            <button key={n.id} className={`seo-nav-btn${view === n.id ? ' active' : ''}`} onClick={() => setView(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>

        <div className="seo-content">
          {loading ? (
            <div className="seo-loading">Loading SEO data…</div>
          ) : (
            <>
              {view === 'checks' && <SeoChecksPanel checks={checks} onRefresh={load} />}
              {view === 'actions' && <SeoActionsPanel actions={actions} onRefresh={load} />}
              {view === 'keywords' && <SeoKeywordsPanel keywords={keywords} onRefresh={load} />}
              {view === 'guidance' && <SeoGuidancePanel />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
