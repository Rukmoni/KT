import { MessageSquare, Clock, CircleCheck as CheckCircle, Circle as XCircle, TrendingUp, TriangleAlert as AlertTriangle } from 'lucide-react';
import { MOCK_CONVERSATIONS, MOCK_ACTIVITY_LOGS, timeAgo } from '../mockData';
import type { ChannelId } from '../types';

const CHANNEL_LABELS: Record<ChannelId, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  telegram: 'Telegram',
  email: 'Email',
  website: 'Website Chat',
};

const INTEGRATION_STATUS = [
  { channel: 'whatsapp' as ChannelId, status: 'connected', count: 156 },
  { channel: 'instagram' as ChannelId, status: 'connected', count: 89 },
  { channel: 'facebook' as ChannelId, status: 'warning', count: 43 },
  { channel: 'telegram' as ChannelId, status: 'connected', count: 67 },
  { channel: 'email' as ChannelId, status: 'connected', count: 234 },
  { channel: 'website' as ChannelId, status: 'error', count: 0 },
];

const priority = (ch: ChannelId) => {
  if (ch === 'whatsapp' || ch === 'email') return 'high';
  if (ch === 'instagram' || ch === 'website') return 'medium';
  return 'low';
};

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView = ({ onNavigate }: DashboardViewProps) => {
  const open = MOCK_CONVERSATIONS.filter(c => c.status === 'open').length;
  const pending = MOCK_CONVERSATIONS.filter(c => c.status === 'pending').length;
  const failedInt = INTEGRATION_STATUS.filter(i => i.status === 'error').length;

  const recentOpen = MOCK_CONVERSATIONS.filter(c => c.status === 'open' || c.status === 'pending').slice(0, 5);

  return (
    <>
      <div className="oh-dash-header">
        <div>
          <h1 className="oh-page-title">Operational Dashboard</h1>
          <p className="oh-page-sub">Monitor your omnichannel operations in real-time</p>
        </div>
        <div className="oh-dash-updated">
          <TrendingUp size={13} color="#2DD4BF" />
          Last updated: just now
        </div>
      </div>

      <div className="oh-metrics">
        <MetricCard
          icon={<MessageSquare size={20} color="#3B82F6" />}
          iconBg="rgba(59,130,246,0.15)"
          value={open}
          label="Open Items"
          badge="+12%"
          badgeBg="rgba(34,197,94,0.12)"
          badgeColor="#4ade80"
          onClick={() => onNavigate('messaging')}
        />
        <MetricCard
          icon={<Clock size={20} color="#f59e0b" />}
          iconBg="rgba(245,158,11,0.15)"
          value={pending}
          label="Pending Responses"
          badge="+3"
          badgeBg="rgba(245,158,11,0.12)"
          badgeColor="#fbbf24"
          onClick={() => onNavigate('messaging')}
        />
        <MetricCard
          icon={<CheckCircle size={20} color="#22c55e" />}
          iconBg="rgba(34,197,94,0.15)"
          value={156}
          label="Closed Items"
          badge="+28%"
          badgeBg="rgba(34,197,94,0.12)"
          badgeColor="#4ade80"
          onClick={() => onNavigate('messaging')}
        />
        <MetricCard
          icon={<XCircle size={20} color="#ef4444" />}
          iconBg="rgba(239,68,68,0.15)"
          value={failedInt}
          label="Failed Integrations"
          badge="-1"
          badgeBg="rgba(239,68,68,0.12)"
          badgeColor="#f87171"
          onClick={() => onNavigate('integrations')}
        />
      </div>

      <div className="oh-dash-grid">
        <div className="oh-card">
          <p className="oh-section-title">
            <MessageSquare size={16} color="#3B82F6" />
            Open Items to Respond
          </p>
          <div className="oh-open-items-list">
            {recentOpen.map(conv => (
              <div key={conv.id} className="oh-open-item" onClick={() => onNavigate('messaging')}>
                <div>
                  <div className="oh-open-item__channel">{CHANNEL_LABELS[conv.channel]}</div>
                  <div className="oh-open-item__name">{conv.customer_name}</div>
                </div>
                <div className="oh-open-item__msg">{conv.last_message}</div>
                <div className="oh-open-item__time">{timeAgo(conv.updated_at)}</div>
                <span className={`oh-priority oh-priority--${priority(conv.channel)}`}>
                  {priority(conv.channel)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="oh-card">
          <p className="oh-section-title">
            <CheckCircle size={16} color="#2DD4BF" />
            Integration Status
          </p>
          <div className="oh-int-status-list">
            {INTEGRATION_STATUS.map(i => (
              <div key={i.channel} className="oh-int-status-item" onClick={() => onNavigate('integrations')}>
                <span className={`oh-int-dot oh-int-dot--${i.status}`} />
                <span className="oh-int-status-item__name">{CHANNEL_LABELS[i.channel]}</span>
                <span className="oh-int-status-item__count">{i.count > 0 ? `${i.count} msgs` : '0 msgs'}</span>
              </div>
            ))}
          </div>
          {failedInt > 0 && (
            <div className="oh-int-warning-box">
              <AlertTriangle size={13} />
              Website Chat integration requires attention
            </div>
          )}
        </div>
      </div>

      <div className="oh-card" style={{ marginTop: 20 }}>
        <p className="oh-section-title" style={{ marginBottom: 16 }}>
          <TrendingUp size={16} color="#2DD4BF" />
          Recent Activity
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {MOCK_ACTIVITY_LOGS.slice(0, 5).map(log => (
            <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span className={`oh-log-status-dot oh-log-status-dot--${log.status}`} />
              <span style={{ flex: 1, fontSize: 13, color: '#CBD5E1' }}>{log.description}</span>
              <span style={{ fontSize: 11.5, color: '#475569', whiteSpace: 'nowrap' }}>{timeAgo(log.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  label: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  onClick: () => void;
}

const MetricCard = ({ icon, iconBg, value, label, badge, badgeBg, badgeColor, onClick }: MetricCardProps) => (
  <div className="oh-metric" onClick={onClick}>
    <div className="oh-metric__icon" style={{ background: iconBg }}>{icon}</div>
    <div className="oh-metric__badge" style={{ background: badgeBg, color: badgeColor }}>{badge}</div>
    <div className="oh-metric__val">{value}</div>
    <div className="oh-metric__label">{label}</div>
  </div>
);
