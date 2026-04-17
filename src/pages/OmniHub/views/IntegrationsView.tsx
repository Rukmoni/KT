import { useState } from 'react';
import { Phone, Mail, Globe, CircleCheck as CheckCircle, Circle as XCircle, Loader, Settings } from 'lucide-react';
import type { ChannelId, IntegrationStatus } from '../types';

interface IntegrationConfig {
  channel: ChannelId;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  status: IntegrationStatus;
  enabled: boolean;
  fields: FieldDef[];
  toggles: ToggleDef[];
}

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'password' | 'number';
  placeholder?: string;
  half?: boolean;
}

interface ToggleDef {
  key: string;
  label: string;
  desc: string;
  defaultOn: boolean;
}

const INTEGRATIONS: IntegrationConfig[] = [
  {
    channel: 'whatsapp',
    label: 'WhatsApp',
    icon: <Phone size={22} color="#22c55e" />,
    iconBg: 'rgba(34,197,94,0.15)',
    status: 'connected',
    enabled: true,
    fields: [
      { key: 'integrationName', label: 'Integration Name', type: 'text', placeholder: 'WhatsApp', half: true },
      { key: 'apiVersion', label: 'API Version', type: 'text', placeholder: 'v2.0', half: true },
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: '••••••••••••••••••••••••••••••' },
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://api.kuvanta.com/webhooks/whatsapp' },
      { key: 'secretToken', label: 'Secret Token', type: 'password', placeholder: '•••••••••••••••••••••••' },
      { key: 'maxMessageLength', label: 'Max Message Length', type: 'number', placeholder: '4096', half: true },
      { key: 'responseTimeout', label: 'Response Timeout (seconds)', type: 'number', placeholder: '30', half: true },
    ],
    toggles: [
      { key: 'enabled', label: 'Enable Integration', desc: 'Allow messages from this channel', defaultOn: true },
      { key: 'autoReply', label: 'Auto-reply', desc: 'Send automated responses', defaultOn: false },
      { key: 'readReceipts', label: 'Read Receipts', desc: 'Send read receipts to customers', defaultOn: true },
    ],
  },
  {
    channel: 'instagram',
    label: 'Instagram',
    icon: <span style={{ fontSize: 18, color: '#e1306c' }}>IG</span>,
    iconBg: 'rgba(225,48,108,0.12)',
    status: 'connected',
    enabled: true,
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: '••••••••••••••••••••' },
      { key: 'pageId', label: 'Page ID', type: 'text', placeholder: 'Enter your Instagram Page ID', half: true },
      { key: 'verifyToken', label: 'Verify Token', type: 'password', placeholder: '•••••••', half: true },
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://api.kuvanta.com/webhooks/instagram' },
    ],
    toggles: [
      { key: 'enabled', label: 'Enable Integration', desc: 'Allow messages from Instagram DMs', defaultOn: true },
      { key: 'storyReplies', label: 'Story Replies', desc: 'Track replies to stories', defaultOn: true },
    ],
  },
  {
    channel: 'facebook',
    label: 'Facebook',
    icon: <span style={{ fontSize: 18, color: '#1877f2' }}>FB</span>,
    iconBg: 'rgba(24,119,242,0.12)',
    status: 'warning',
    enabled: false,
    fields: [
      { key: 'accessToken', label: 'Page Access Token', type: 'password', placeholder: '••••••••••••••••••••' },
      { key: 'pageId', label: 'Page ID', type: 'text', placeholder: 'Enter your Facebook Page ID', half: true },
      { key: 'verifyToken', label: 'Verify Token', type: 'password', placeholder: '•••••••', half: true },
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://api.kuvanta.com/webhooks/facebook' },
    ],
    toggles: [
      { key: 'enabled', label: 'Enable Integration', desc: 'Allow messages from Facebook Messenger', defaultOn: false },
      { key: 'commentsMonitor', label: 'Monitor Comments', desc: 'Track post comments as conversations', defaultOn: false },
    ],
  },
  {
    channel: 'telegram',
    label: 'Telegram',
    icon: <span style={{ fontSize: 18, color: '#0088cc' }}>TG</span>,
    iconBg: 'rgba(0,136,204,0.12)',
    status: 'connected',
    enabled: true,
    fields: [
      { key: 'botToken', label: 'Bot Token', type: 'password', placeholder: '••••••••:••••••••••••••••••••••••••••••••' },
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://api.kuvanta.com/webhooks/telegram' },
      { key: 'allowedUpdates', label: 'Allowed Updates', type: 'text', placeholder: 'message,callback_query' },
    ],
    toggles: [
      { key: 'enabled', label: 'Enable Integration', desc: 'Allow messages from Telegram', defaultOn: true },
      { key: 'inlineMode', label: 'Inline Mode', desc: 'Support inline bot queries', defaultOn: false },
    ],
  },
  {
    channel: 'email',
    label: 'Email',
    icon: <Mail size={22} color="#f59e0b" />,
    iconBg: 'rgba(245,158,11,0.12)',
    status: 'connected',
    enabled: true,
    fields: [
      { key: 'smtpHost', label: 'SMTP Host', type: 'text', placeholder: 'smtp.gmail.com', half: true },
      { key: 'smtpPort', label: 'SMTP Port', type: 'number', placeholder: '587', half: true },
      { key: 'smtpUser', label: 'SMTP Username', type: 'text', placeholder: 'support@kuvanta.com', half: true },
      { key: 'smtpPass', label: 'SMTP Password', type: 'password', placeholder: '••••••••', half: true },
      { key: 'imapHost', label: 'IMAP Host', type: 'text', placeholder: 'imap.gmail.com', half: true },
      { key: 'imapPort', label: 'IMAP Port', type: 'number', placeholder: '993', half: true },
      { key: 'fromEmail', label: 'From Email', type: 'text', placeholder: 'support@kuvanta.com' },
    ],
    toggles: [
      { key: 'enabled', label: 'Enable Integration', desc: 'Allow incoming emails as conversations', defaultOn: true },
      { key: 'autoAssign', label: 'Auto-assign', desc: 'Automatically assign incoming emails', defaultOn: true },
    ],
  },
  {
    channel: 'website',
    label: 'Website Chat',
    icon: <Globe size={22} color="#8b5cf6" />,
    iconBg: 'rgba(139,92,246,0.12)',
    status: 'error',
    enabled: false,
    fields: [
      { key: 'widgetId', label: 'Widget ID', type: 'text', placeholder: 'Enter widget ID' },
      { key: 'primaryColor', label: 'Primary Color', type: 'text', placeholder: '#3B82F6', half: true },
      { key: 'position', label: 'Position', type: 'text', placeholder: 'bottom-right', half: true },
      { key: 'welcomeMessage', label: 'Welcome Message', type: 'text', placeholder: 'Hi! How can we help?' },
      { key: 'offlineMessage', label: 'Offline Message', type: 'text', placeholder: 'We are currently offline.' },
    ],
    toggles: [
      { key: 'enabled', label: 'Enable Integration', desc: 'Show chat widget on your website', defaultOn: false },
      { key: 'showBranding', label: 'Show Branding', desc: 'Display Kuvanta branding on widget', defaultOn: true },
    ],
  },
];

type TestState = 'idle' | 'testing' | 'success' | 'failure';

export const IntegrationsView = () => {
  const [active, setActive] = useState<ChannelId>('whatsapp');
  const [toggles, setToggles] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    INTEGRATIONS.forEach(i => {
      init[i.channel] = {};
      i.toggles.forEach(t => { init[i.channel][t.key] = t.defaultOn; });
    });
    return init;
  });
  const [testState, setTestState] = useState<TestState>('idle');
  const [testMsg, setTestMsg] = useState('');

  const integration = INTEGRATIONS.find(i => i.channel === active)!;

  const handleTest = async () => {
    setTestState('testing');
    setTestMsg('');
    await new Promise(r => setTimeout(r, 1400));
    if (integration.status === 'connected') {
      setTestState('success');
      setTestMsg(`Connection to ${integration.label} verified. All endpoints responding normally.`);
    } else {
      setTestState('failure');
      setTestMsg(`Failed to connect to ${integration.label}. Check your credentials or webhook configuration.`);
    }
  };

  return (
    <>
      <h1 className="oh-page-title">Integrations Configuration</h1>
      <p className="oh-page-sub">Connect and manage your messaging channels</p>

      <div className="oh-int-root">
        <div className="oh-int-nav">
          <div className="oh-int-nav__label">Available Integrations</div>
          {INTEGRATIONS.map(i => (
            <button
              key={i.channel}
              className={`oh-int-nav-item${active === i.channel ? ' oh-int-nav-item--active' : ''}`}
              onClick={() => { setActive(i.channel); setTestState('idle'); }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: i.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {i.icon}
              </div>
              <span className="oh-int-nav-item__name">{i.label}</span>
              <StatusDot status={i.status} />
            </button>
          ))}
        </div>

        <div className="oh-int-panel">
          <div className="oh-int-panel__header">
            <div style={{ width: 48, height: 48, borderRadius: 14, background: integration.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {integration.icon}
            </div>
            <div>
              <h2 className="oh-int-panel__title">{integration.label} Integration</h2>
              <div className={`oh-int-status-pill`}>
                <StatusDot status={integration.status} />
                <span style={{ color: statusColor(integration.status), fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                  {integration.status}
                </span>
              </div>
            </div>
            <div className="oh-int-panel__actions">
              <button className="oh-int-btn oh-int-btn--ghost" onClick={handleTest} disabled={testState === 'testing'}>
                {testState === 'testing' ? (
                  <><Loader size={13} className="oh-spin" style={{ display: 'inline', marginRight: 5 }} />Testing…</>
                ) : 'Test Connection'}
              </button>
              <button className="oh-int-btn oh-int-btn--primary">Save Changes</button>
            </div>
          </div>

          <div className="oh-int-panel__body">
            {testState !== 'idle' && (
              <div className={`oh-test-result oh-test-result--${testState}`} style={{ marginBottom: 20 }}>
                {testState === 'testing' && <Loader size={14} className="oh-spin" />}
                {testState === 'success' && <CheckCircle size={14} />}
                {testState === 'failure' && <XCircle size={14} />}
                {testState === 'testing' ? 'Testing connection…' : testMsg}
              </div>
            )}

            <div className="oh-int-section">
              <div className="oh-int-section__label"><Settings size={12} />General Settings</div>
              <div className="oh-int-grid">
                {integration.toggles.map(t => (
                  <div key={t.key} className="oh-toggle-row" style={{ gridColumn: '1 / -1' }}>
                    <div className="oh-toggle-row__info">
                      <div className="oh-toggle-row__title">{t.label}</div>
                      <div className="oh-toggle-row__desc">{t.desc}</div>
                    </div>
                    <label className="oh-toggle">
                      <input
                        type="checkbox"
                        checked={toggles[integration.channel]?.[t.key] ?? t.defaultOn}
                        onChange={e => setToggles(prev => ({
                          ...prev,
                          [integration.channel]: { ...prev[integration.channel], [t.key]: e.target.checked }
                        }))}
                      />
                      <span className="oh-toggle__track" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="oh-int-section">
              <div className="oh-int-section__label">API Configuration</div>
              <div className="oh-int-grid">
                {integration.fields.map(f => (
                  <div key={f.key} className="oh-int-field" style={{ gridColumn: f.half ? 'span 1' : '1 / -1' }}>
                    <label className="oh-int-field-label">{f.label}</label>
                    <input
                      className="oh-int-input"
                      type={f.type}
                      placeholder={f.placeholder}
                      defaultValue={f.type === 'password' ? '•'.repeat(24) : (f.placeholder ?? '')}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="oh-int-btn oh-int-btn--primary" style={{ flex: 1 }}>Save Changes</button>
              {integration.enabled && (
                <button className="oh-int-btn oh-int-btn--danger">Disable Integration</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const StatusDot = ({ status }: { status: IntegrationStatus }) => (
  <span className={`oh-int-dot oh-int-dot--${status}`} />
);

function statusColor(s: IntegrationStatus) {
  if (s === 'connected') return '#4ade80';
  if (s === 'warning') return '#fbbf24';
  if (s === 'error') return '#f87171';
  return '#64748B';
}
