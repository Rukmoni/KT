import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, FileText, ChartBar as BarChart2, Bot, MessageSquare, CalendarRange, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './DemoListPage.css';

const DEMOS = [
  {
    id: 'note2task',
    label: 'Note2Task',
    icon: FileText,
    tagline: 'Convert meeting notes into delivery-ready tasks.',
    description: 'Turn transcripts, voice notes, and meeting minutes into structured Jira-ready work items in minutes. Built for delivery teams, consultants, and project managers.',
    badge: 'New',
    badgeColor: '#2563eb',
    path: '/demo/note2task',
    tags: ['AI', 'Jira', 'Project Management'],
    accent: '#2563eb',
  },
  {
    id: 'KT_omnichannel_demo',
    label: 'KuvantaOmniHub',
    icon: MessageSquare,
    tagline: 'Unified omnichannel vendor control center.',
    description: 'Manage all messaging channels (WhatsApp, Instagram, Facebook, Telegram, Email, Website) in one place. Configure AI knowledge sources, manage integrations, and audit all activity from a single dashboard.',
    badge: 'Live',
    badgeColor: '#0d9488',
    path: '/demo/KT_omnichannel_demo',
    tags: ['Omnichannel', 'AI', 'Messaging', 'Integrations'],
    accent: '#0d9488',
  },
  {
    id: 'analytics',
    label: 'Smart Analytics',
    icon: BarChart2,
    tagline: 'AI-powered insights from your business data.',
    description: 'Connect your data sources and get instant AI-generated summaries, trend analysis, and actionable recommendations — no dashboard setup required.',
    badge: 'Coming Soon',
    badgeColor: '#64748b',
    path: null,
    tags: ['AI', 'Analytics', 'BI'],
    accent: '#0ea5e9',
  },
  {
    id: 'chatbot',
    label: 'AI Support Agent',
    icon: Bot,
    tagline: 'Intelligent customer support powered by your knowledge base.',
    description: 'Deploy a context-aware AI agent trained on your documentation, FAQs, and product data to handle support queries instantly.',
    badge: 'Live',
    badgeColor: '#16a34a',
    path: '/chatbot-demo',
    tags: ['AI', 'Support', 'Automation'],
    accent: '#10b981',
  },
  {
    id: 'gantt-studio',
    label: 'Gantt Studio',
    icon: CalendarRange,
    tagline: 'Interactive Gantt chart planner for project scheduling.',
    description: 'A visual project scheduling tool for creating, editing, and sharing Gantt charts. Drag tasks, set dependencies, and export timelines — no signup required.',
    badge: 'Live',
    badgeColor: '#7c3aed',
    path: '/Gantt-Studio/',
    external: true,
    tags: ['Scheduling', 'Project Planning', 'Gantt'],
    accent: '#7c3aed',
  },
];

export const DemoListPage = () => {
  const navigate = useNavigate();
  const [ganttVisits, setGanttVisits] = useState<number | null>(null);

  const fetchGanttVisits = useCallback(async () => {
    const { count, error } = await supabase
      .from('demo_visits')
      .select('*', { count: 'exact', head: true })
      .eq('demo_id', 'gantt-studio');

    if (error) {
      console.error('Failed to fetch visit count:', error.message);
      return;
    }
    setGanttVisits(count ?? 0);
  }, []);

  useEffect(() => {
    fetchGanttVisits();
  }, [fetchGanttVisits]);

  const recordVisit = async (demoId: string) => {
    const { error } = await supabase
      .from('demo_visits')
      .insert({ demo_id: demoId });

    if (error) {
      console.error('Failed to record visit:', error.message);
    }
  };

  const handleDemoClick = (demo: typeof DEMOS[number]) => {
    if (!demo.path) return;
    if (demo.id === 'gantt-studio') {
      recordVisit('gantt-studio').then(() => fetchGanttVisits());
      window.open(demo.path, '_blank');
    } else {
      navigate(demo.path);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="demo-list-page"
    >
      <div className="demo-list-hero">
        <div className="demo-list-hero__inner">
          <div className="demo-list-hero__eyebrow">
            <Zap size={14} />
            <span>Live Demos</span>
          </div>
          <h1 className="demo-list-hero__title">
            See KuvantaTech<br />
            <span className="demo-list-hero__title-accent">in action</span>
          </h1>
          <p className="demo-list-hero__subtitle">
            Explore interactive demos of our AI-powered products. Each demo reflects a real solution
            we've built for delivery teams, startups, and enterprise clients.
          </p>
        </div>
      </div>

      <div className="demo-list-grid-wrap">
        <div className="demo-list-grid">
          {DEMOS.map((demo, i) => {
            const Icon = demo.icon;
            return (
              <motion.div
                key={demo.id}
                className={`demo-card${!demo.path ? ' demo-card--disabled' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ '--demo-accent': demo.accent } as React.CSSProperties}
              >
                <div className="demo-card__header">
                  <div className="demo-card__icon-wrap" style={{ background: `${demo.accent}18`, border: `1px solid ${demo.accent}30` }}>
                    <Icon size={22} color={demo.accent} />
                  </div>
                  <span className="demo-card__badge" style={{ background: `${demo.badgeColor}18`, color: demo.badgeColor, border: `1px solid ${demo.badgeColor}30` }}>
                    {demo.badge}
                  </span>
                </div>

                <div className="demo-card__body">
                  <h3 className="demo-card__title">{demo.label}</h3>
                  <p className="demo-card__tagline">{demo.tagline}</p>
                  <p className="demo-card__description">{demo.description}</p>

                  <div className="demo-card__tags">
                    {demo.tags.map(tag => (
                      <span key={tag} className="demo-card__tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="demo-card__footer">
                  {demo.path ? (
                    <>
                      <button
                        className="demo-card__cta"
                        style={{ background: demo.accent }}
                        onClick={() => handleDemoClick(demo)}
                      >
                        Open Demo
                        <ArrowRight size={15} />
                      </button>
                      {demo.id === 'gantt-studio' && (
                        <span className="demo-card__visits">
                          <Users size={13} />
                          {ganttVisits !== null ? `${ganttVisits} ${ganttVisits === 1 ? 'visit' : 'visits'}` : '—'}
                        </span>
                      )}
                    </>
                  ) : (
                    <button className="demo-card__cta demo-card__cta--disabled" disabled>
                      Coming Soon
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.main>
  );
};
