import { useState } from 'react';
import { Check, X, Loader as Loader2, ChevronDown, ChevronUp, TestTube, Save, Eye, EyeOff } from 'lucide-react';
import { mockTestConnection } from './mockServices';
import type { TestResult } from './mockServices';

type TabId = 'zoom' | 'jira' | 'slack';
type StatusKind = 'not_configured' | 'connected' | 'test_passed' | 'error';

interface IntegrationState {
  status: StatusKind;
  lastTested?: string;
  lastResult?: string;
}

const INITIAL_ZOOM = {
  label: 'KuvantaTech Workspace',
  clientId: '',
  clientSecret: '',
  redirectUri: 'https://kuvanta.tech/api/zoom/callback',
  webhookSecret: '',
  webhookEndpoint: 'https://kuvanta.tech/api/webhooks/zoom',
  transcriptOnly: true,
  autoFetch: true,
};

const INITIAL_JIRA = {
  label: 'KuvantaTech Jira',
  siteUrl: 'kuvantatech.atlassian.net',
  email: 'admin@kuvanta.tech',
  apiToken: '',
  projectKey: 'KVT',
  issueType: 'Task',
  labelPrefix: 'ai-gen',
  authMethod: 'api_token' as const,
};

const INITIAL_SLACK = {
  label: 'KuvantaTech Slack',
  botToken: '',
  webhookUrl: '',
  defaultChannel: '#jira-updates',
  useWebhook: false,
  postOnSuccess: true,
  postOnFailure: true,
};

export const ConnectionsView = () => {
  const [activeTab, setActiveTab] = useState<TabId>('zoom');
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [jira, setJira] = useState(INITIAL_JIRA);
  const [slack, setSlack] = useState(INITIAL_SLACK);
  const [integStatus, setIntegStatus] = useState<Record<TabId, IntegrationState>>({
    zoom: { status: 'not_configured' },
    jira: { status: 'not_configured' },
    slack: { status: 'not_configured' },
  });
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [saved, setSaved] = useState<Record<TabId, boolean>>({ zoom: false, jira: false, slack: false });
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleSecret = (key: string) => setShowSecrets(p => ({ ...p, [key]: !p[key] }));

  const runTest = async (type: TabId, testType: string) => {
    const key = `${type}_${testType}`;
    setTesting(p => ({ ...p, [key]: true }));
    const result = await mockTestConnection(type, testType);
    setTestResults(p => ({ ...p, [key]: result }));
    setTesting(p => ({ ...p, [key]: false }));
    setIntegStatus(p => ({
      ...p,
      [type]: {
        status: result.passed ? 'test_passed' : 'error',
        lastTested: new Date().toLocaleTimeString(),
        lastResult: result.message,
      },
    }));
  };

  const handleSave = (type: TabId) => {
    setSaved(p => ({ ...p, [type]: true }));
    setIntegStatus(p => ({ ...p, [type]: { ...p[type], status: p[type].status === 'not_configured' ? 'connected' : p[type].status } }));
    setTimeout(() => setSaved(p => ({ ...p, [type]: false })), 2000);
  };

  const STATUS_LABELS: Record<StatusKind, string> = {
    not_configured: 'Not Configured',
    connected: 'Connected',
    test_passed: 'Test Passed',
    error: 'Error',
  };

  const STATUS_COLORS: Record<StatusKind, string> = {
    not_configured: '#475569',
    connected: '#3b82f6',
    test_passed: '#22c55e',
    error: '#ef4444',
  };

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'zoom', label: 'Zoom', icon: '📹' },
    { id: 'jira', label: 'Jira', icon: '📋' },
    { id: 'slack', label: 'Slack', icon: '💬' },
  ];

  return (
    <div className="cv-root">
      <div className="cv-header">
        <h2 className="cv-title">Integration Connections</h2>
        <p className="cv-sub">Configure and test your Zoom, Jira, and Slack integrations.</p>
      </div>

      <div className="cv-status-bar">
        {tabs.map(t => {
          const s = integStatus[t.id];
          return (
            <div key={t.id} className="cv-status-card">
              <span className="cv-status-icon">{t.icon}</span>
              <div>
                <p className="cv-status-name">{t.label}</p>
                <p className="cv-status-state" style={{ color: STATUS_COLORS[s.status] }}>
                  {s.status === 'test_passed' && <Check size={11} />}
                  {s.status === 'error' && <X size={11} />}
                  {STATUS_LABELS[s.status]}
                </p>
              </div>
              {s.lastTested && <p className="cv-status-time">Tested {s.lastTested}</p>}
            </div>
          );
        })}
      </div>

      <div className="cv-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`cv-tab${activeTab === t.id ? ' cv-tab--active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.icon} {t.label}
            <span className="cv-tab-badge" style={{ background: STATUS_COLORS[integStatus[t.id].status] }} />
          </button>
        ))}
      </div>

      <div className="cv-panel">

        {/* ── ZOOM ── */}
        {activeTab === 'zoom' && (
          <div className="cv-form">
            <Section title="Account Details">
              <Field label="Account Label">
                <input className="cv-input" value={zoom.label} onChange={e => setZoom(p => ({ ...p, label: e.target.value }))} />
              </Field>
              <Field label="Client ID">
                <input className="cv-input" value={zoom.clientId} onChange={e => setZoom(p => ({ ...p, clientId: e.target.value }))} placeholder="Enter Zoom App Client ID" />
              </Field>
              <Field label="Client Secret">
                <SecretInput value={zoom.clientSecret} show={showSecrets['zoom_secret']} onToggle={() => toggleSecret('zoom_secret')} onChange={v => setZoom(p => ({ ...p, clientSecret: v }))} placeholder="Enter Zoom App Client Secret" />
              </Field>
              <Field label="Redirect URI">
                <input className="cv-input cv-input--mono" value={zoom.redirectUri} onChange={e => setZoom(p => ({ ...p, redirectUri: e.target.value }))} />
              </Field>
            </Section>

            <Section title="Webhook Configuration">
              <Field label="Webhook Secret / Verification Token">
                <SecretInput value={zoom.webhookSecret} show={showSecrets['zoom_wh']} onToggle={() => toggleSecret('zoom_wh')} onChange={v => setZoom(p => ({ ...p, webhookSecret: v }))} placeholder="Zoom webhook verification token" />
              </Field>
              <Field label="Webhook Endpoint URL">
                <input className="cv-input cv-input--mono" value={zoom.webhookEndpoint} readOnly />
              </Field>
              <div className="cv-info-box">
                <p className="cv-info-label">Subscribed Events</p>
                <div className="cv-tags">
                  <span className="cv-tag">recording.completed</span>
                  <span className="cv-tag">recording.transcript_completed</span>
                </div>
              </div>
            </Section>

            <Section title="Behavior">
              <Toggle label="Transcript-only processing" sub="Skip video; only process VTT transcript files" checked={zoom.transcriptOnly} onChange={v => setZoom(p => ({ ...p, transcriptOnly: v }))} />
              <Toggle label="Auto-fetch recording after event" sub="Automatically retrieve transcript when event arrives" checked={zoom.autoFetch} onChange={v => setZoom(p => ({ ...p, autoFetch: v }))} />
            </Section>

            <TestSection>
              <TestBtn label="Test OAuth Credentials" type="zoom" testType="auth" testing={testing} results={testResults} onTest={runTest} />
              <TestBtn label="Test Webhook Verification" type="zoom" testType="webhook" testing={testing} results={testResults} onTest={runTest} />
              <TestBtn label="Test Transcript Access" type="zoom" testType="transcript" testing={testing} results={testResults} onTest={runTest} />
            </TestSection>

            <FormActions type="zoom" saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* ── JIRA ── */}
        {activeTab === 'jira' && (
          <div className="cv-form">
            <Section title="Connection">
              <Field label="Jira Site URL">
                <div className="cv-input-prefix">
                  <span className="cv-prefix">https://</span>
                  <input className="cv-input cv-input--prefixed cv-input--mono" value={jira.siteUrl} onChange={e => setJira(p => ({ ...p, siteUrl: e.target.value }))} />
                </div>
              </Field>
              <Field label="Auth Method">
                <select className="cv-input" value={jira.authMethod} onChange={e => setJira(p => ({ ...p, authMethod: e.target.value as typeof p.authMethod }))}>
                  <option value="api_token">API Token</option>
                  <option value="oauth">OAuth 2.0 (coming soon)</option>
                </select>
              </Field>
              <Field label="Service Account Email">
                <input className="cv-input" type="email" value={jira.email} onChange={e => setJira(p => ({ ...p, email: e.target.value }))} />
              </Field>
              <Field label="API Token">
                <SecretInput value={jira.apiToken} show={showSecrets['jira_token']} onToggle={() => toggleSecret('jira_token')} onChange={v => setJira(p => ({ ...p, apiToken: v }))} placeholder="Atlassian API token" />
              </Field>
            </Section>

            <Section title="Ticket Defaults">
              <Field label="Default Project Key">
                <input className="cv-input" value={jira.projectKey} onChange={e => setJira(p => ({ ...p, projectKey: e.target.value.toUpperCase() }))} placeholder="e.g. KVT" />
              </Field>
              <Field label="Default Issue Type">
                <select className="cv-input" value={jira.issueType} onChange={e => setJira(p => ({ ...p, issueType: e.target.value }))}>
                  <option>Task</option>
                  <option>Story</option>
                  <option>Bug</option>
                  <option>Sub-task</option>
                </select>
              </Field>
              <Field label="AI-generated Label Prefix">
                <input className="cv-input" value={jira.labelPrefix} onChange={e => setJira(p => ({ ...p, labelPrefix: e.target.value }))} placeholder="e.g. ai-gen" />
              </Field>
            </Section>

            <div className="cv-field-map">
              <p className="cv-field-map__title">Field Mapping</p>
              <div className="cv-field-map__grid">
                {['Summary', 'Description', 'Assignee', 'Labels', 'Priority', 'Due Date'].map(f => (
                  <div key={f} className="cv-field-map__row">
                    <span className="cv-field-map__ai">{f}</span>
                    <span className="cv-field-map__arrow">→</span>
                    <span className="cv-field-map__jira">{f}</span>
                    <span className="cv-field-map__status"><Check size={11} color="#22c55e" /></span>
                  </div>
                ))}
              </div>
            </div>

            <TestSection>
              <TestBtn label="Test Authentication" type="jira" testType="auth" testing={testing} results={testResults} onTest={runTest} />
              <TestBtn label="Load Projects" type="jira" testType="projects" testing={testing} results={testResults} onTest={runTest} />
              <TestBtn label="Test Issue Creation (dry run)" type="jira" testType="create" testing={testing} results={testResults} onTest={runTest} />
            </TestSection>

            <FormActions type="jira" saved={saved} onSave={handleSave} />
          </div>
        )}

        {/* ── SLACK ── */}
        {activeTab === 'slack' && (
          <div className="cv-form">
            <Section title="App Credentials">
              <Field label="Workspace Label">
                <input className="cv-input" value={slack.label} onChange={e => setSlack(p => ({ ...p, label: e.target.value }))} />
              </Field>
              <Field label="Auth Mode">
                <div className="cv-toggle-group">
                  <button className={`cv-mode-btn${!slack.useWebhook ? ' active' : ''}`} onClick={() => setSlack(p => ({ ...p, useWebhook: false }))}>Bot Token</button>
                  <button className={`cv-mode-btn${slack.useWebhook ? ' active' : ''}`} onClick={() => setSlack(p => ({ ...p, useWebhook: true }))}>Incoming Webhook</button>
                </div>
              </Field>
              {slack.useWebhook ? (
                <Field label="Incoming Webhook URL">
                  <SecretInput value={slack.webhookUrl} show={showSecrets['slack_wh']} onToggle={() => toggleSecret('slack_wh')} onChange={v => setSlack(p => ({ ...p, webhookUrl: v }))} placeholder="https://hooks.slack.com/services/..." />
                </Field>
              ) : (
                <Field label="Bot Token">
                  <SecretInput value={slack.botToken} show={showSecrets['slack_bt']} onToggle={() => toggleSecret('slack_bt')} onChange={v => setSlack(p => ({ ...p, botToken: v }))} placeholder="xoxb-..." />
                </Field>
              )}
              <Field label="Default Channel">
                <input className="cv-input" value={slack.defaultChannel} onChange={e => setSlack(p => ({ ...p, defaultChannel: e.target.value }))} placeholder="#channel-name" />
              </Field>
            </Section>

            <Section title="Notification Rules">
              <Toggle label="Notify on success" sub="Post when Jira tickets are created successfully" checked={slack.postOnSuccess} onChange={v => setSlack(p => ({ ...p, postOnSuccess: v }))} />
              <Toggle label="Notify on failure" sub="Alert admin channel when workflow fails" checked={slack.postOnFailure} onChange={v => setSlack(p => ({ ...p, postOnFailure: v }))} />
            </Section>

            <div className="cv-message-preview">
              <p className="cv-field-map__title">Message Preview (Block Kit)</p>
              <div className="cv-slack-preview">
                <div className="cv-slack-preview__bar" />
                <div className="cv-slack-preview__body">
                  <p className="cv-slack-preview__title">Meeting processed: Q4 Sprint Review</p>
                  <p className="cv-slack-preview__text">AI extracted 7 action items · 6 Jira tickets created · 1 pending review</p>
                  <div className="cv-slack-preview__links">
                    <span className="cv-slack-link">KVT-042</span>
                    <span className="cv-slack-link">KVT-043</span>
                    <span className="cv-slack-link">KVT-044</span>
                    <span className="cv-slack-link">+3 more</span>
                  </div>
                </div>
              </div>
            </div>

            <TestSection>
              <TestBtn label="Test Authentication" type="slack" testType="auth" testing={testing} results={testResults} onTest={runTest} />
              <TestBtn label="Test Channel Access" type="slack" testType="channel" testing={testing} results={testResults} onTest={runTest} />
              <TestBtn label="Send Test Message" type="slack" testType="message" testing={testing} results={testResults} onTest={runTest} />
            </TestSection>

            <FormActions type="slack" saved={saved} onSave={handleSave} />
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="cv-section">
    <p className="cv-section__title">{title}</p>
    <div className="cv-section__body">{children}</div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="cv-field">
    <label className="cv-label">{label}</label>
    {children}
  </div>
);

const Toggle = ({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="cv-toggle-row">
    <div>
      <p className="cv-toggle-label">{label}</p>
      <p className="cv-toggle-sub">{sub}</p>
    </div>
    <button className={`cv-toggle-switch${checked ? ' on' : ''}`} onClick={() => onChange(!checked)}>
      <span className="cv-toggle-knob" />
    </button>
  </div>
);

const SecretInput = ({ value, show, onToggle, onChange, placeholder }: { value: string; show: boolean; onToggle: () => void; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="cv-secret-wrap">
    <input className="cv-input cv-input--mono" type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    <button className="cv-secret-toggle" onClick={onToggle} type="button">
      {show ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  </div>
);

const TestSection = ({ children }: { children: React.ReactNode }) => (
  <div className="cv-test-section">
    <p className="cv-section__title">Test Connections</p>
    <div className="cv-test-grid">{children}</div>
  </div>
);

const TestBtn = ({ label, type, testType, testing, results, onTest }: {
  label: string;
  type: 'zoom' | 'jira' | 'slack';
  testType: string;
  testing: Record<string, boolean>;
  results: Record<string, TestResult>;
  onTest: (type: 'zoom' | 'jira' | 'slack', tt: string) => void;
}) => {
  const key = `${type}_${testType}`;
  const isTesting = testing[key];
  const result = results[key];
  const [open, setOpen] = useState(false);

  return (
    <div className="cv-test-card">
      <div className="cv-test-card__top">
        <span className="cv-test-card__label">{label}</span>
        <div className="cv-test-card__actions">
          {result && (
            <button className="cv-test-expand" onClick={() => setOpen(o => !o)}>
              {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          )}
          <button
            className={`cv-test-btn${isTesting ? ' loading' : ''}${result ? (result.passed ? ' passed' : ' failed') : ''}`}
            onClick={() => onTest(type, testType)}
            disabled={isTesting}
          >
            {isTesting ? <Loader2 size={13} className="spin" /> : <TestTube size={13} />}
            {isTesting ? 'Testing…' : result ? 'Re-test' : 'Test'}
          </button>
        </div>
      </div>
      {result && !open && (
        <p className={`cv-test-card__result${result.passed ? ' pass' : ' fail'}`}>
          {result.passed ? <Check size={11} /> : <X size={11} />}
          {result.message}
          <span className="cv-test-latency">{result.latencyMs}ms</span>
        </p>
      )}
      {result && open && result.details && (
        <div className="cv-test-details">
          {Object.entries(result.details).map(([k, v]) => (
            <div key={k} className="cv-test-details__row">
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FormActions = ({ type, saved, onSave }: { type: 'zoom' | 'jira' | 'slack'; saved: Record<string, boolean>; onSave: (t: 'zoom' | 'jira' | 'slack') => void }) => (
  <div className="cv-form-actions">
    <button className="cv-btn cv-btn--primary" onClick={() => onSave(type)}>
      {saved[type] ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Configuration</>}
    </button>
  </div>
);
