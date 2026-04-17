import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, MessageSquare, Settings, Brain, Activity, LogOut } from 'lucide-react';
import { DashboardView } from './views/DashboardView';
import { MessagingView } from './views/MessagingView';
import { IntegrationsView } from './views/IntegrationsView';
import { AiConfigView } from './views/AiConfigView';
import { ActivityLogsView } from './views/ActivityLogsView';
import './OmniHub.css';

type View = 'dashboard' | 'messaging' | 'integrations' | 'ai-config' | 'activity';

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { id: 'messaging', label: 'Messaging', icon: <MessageSquare size={15} /> },
  { id: 'integrations', label: 'Integrations', icon: <Settings size={15} /> },
  { id: 'ai-config', label: 'AI Config', icon: <Brain size={15} /> },
  { id: 'activity', label: 'Activity', icon: <Activity size={15} /> },
];

interface OmniHubAppProps {
  user: User;
}

export const OmniHubApp = ({ user }: OmniHubAppProps) => {
  const [view, setView] = useState<View>('dashboard');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userInitials = (user.email ?? 'U').slice(0, 2).toUpperCase();

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardView onNavigate={v => setView(v as View)} />;
      case 'messaging': return <MessagingView />;
      case 'integrations': return <IntegrationsView />;
      case 'ai-config': return <AiConfigView />;
      case 'activity': return <ActivityLogsView />;
    }
  };

  return (
    <div className="oh-root">
      <style>{`
        @keyframes oh-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .oh-spin { animation: oh-spin 0.7s linear infinite; }
      `}</style>

      <nav className="oh-nav">
        <div className="oh-nav__logo">
          Kuvanta<span>OmniHub</span>
        </div>
        <div className="oh-nav__items">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`oh-nav__item${view === item.id ? ' oh-nav__item--active' : ''}`}
              onClick={() => setView(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        <div className="oh-nav__right">
          <div className="oh-nav__user">
            <div className="oh-nav__avatar">{userInitials}</div>
            <span style={{ fontSize: 13, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </span>
          </div>
          <button className="oh-nav__logout" onClick={handleLogout}>
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </nav>

      <main className="oh-content" style={view === 'messaging' ? { paddingBottom: 0 } : undefined}>
        {renderView()}
      </main>
    </div>
  );
};
