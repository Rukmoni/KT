export interface IntegrationConfig {
  zoom: {
    label: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    webhookSecret: string;
    webhookEndpoint: string;
    transcriptOnly: boolean;
    autoFetch: boolean;
  };
  jira: {
    label: string;
    siteUrl: string;
    email: string;
    apiToken: string;
    projectKey: string;
    issueType: string;
    labelPrefix: string;
    authMethod: 'api_token' | 'oauth';
  };
  slack: {
    label: string;
    botToken: string;
    webhookUrl: string;
    defaultChannel: string;
    useWebhook: boolean;
    postOnSuccess: boolean;
    postOnFailure: boolean;
  };
}

export type IntegrationStatus = 'not_configured' | 'connected' | 'test_passed' | 'error';

export interface TestResult {
  passed: boolean;
  message: string;
  latencyMs: number;
  details?: Record<string, string>;
  error?: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  message?: string;
  duration?: number;
}

export interface MeetingRecord {
  id: string;
  title: string;
  host: string;
  attendees: string[];
  date: string;
  duration: number;
  source: string;
  status: 'received' | 'transcript_fetched' | 'ai_analyzed' | 'jira_created' | 'slack_notified' | 'failed';
  jiraCount?: number;
}

export interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  details: string;
  timestamp: string;
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function mockTestConnection(type: 'zoom' | 'jira' | 'slack', testType: string): Promise<TestResult> {
  await delay(1200 + Math.random() * 600);
  const latencyMs = Math.floor(180 + Math.random() * 120);

  const results: Record<string, Record<string, TestResult>> = {
    zoom: {
      auth: { passed: true, message: 'OAuth credentials verified. Zoom account active.', latencyMs, details: { 'Account': 'KuvantaTech Workspace', 'Plan': 'Business Pro', 'Scopes': 'recording:read, meeting:read' } },
      webhook: { passed: true, message: 'Webhook endpoint reachable. Verification token valid.', latencyMs, details: { 'Endpoint': 'Reachable (200)', 'Events': 'recording.completed, transcript.completed' } },
      transcript: { passed: true, message: 'Transcript access confirmed. Sample recording retrieved.', latencyMs, details: { 'Sample Meeting': 'Q4 Sprint Review', 'Transcript Length': '12,450 chars' } },
    },
    jira: {
      auth: { passed: true, message: 'Jira API token accepted. Site accessible.', latencyMs, details: { 'Site': 'kuvantatech.atlassian.net', 'User': 'admin@kuvantatech.com', 'Role': 'Administrator' } },
      projects: { passed: true, message: 'Found 8 accessible projects.', latencyMs, details: { 'Projects': 'KVT, RETAIL, INFRA, SEC, MKT, DEV, OPS, DATA', 'Default': 'KVT' } },
      create: { passed: true, message: 'Test issue KVT-TEST-001 created and deleted successfully.', latencyMs, details: { 'Issue': 'KVT-TEST-001', 'Type': 'Task', 'Project': 'KVT' } },
    },
    slack: {
      auth: { passed: true, message: 'Bot token valid. Workspace connected.', latencyMs, details: { 'Workspace': 'KuvantaTech', 'Bot': '@note2task-bot', 'Scopes': 'chat:write, channels:read' } },
      channel: { passed: true, message: 'Bot has access to #jira-updates channel.', latencyMs, details: { 'Channel': '#jira-updates', 'Members': '14', 'Bot Member': 'Yes' } },
      message: { passed: true, message: 'Test message sent to #jira-updates successfully.', latencyMs, details: { 'Message ID': 'msg_' + Date.now(), 'Delivered': 'Yes' } },
    },
  };

  return results[type]?.[testType] ?? { passed: false, message: 'Unknown test type.', latencyMs };
}

export async function runSampleWorkflow(onStep: (step: WorkflowStep) => void): Promise<void> {
  const steps: Array<{ id: string; label: string; durationMs: number; message: string }> = [
    { id: 'zoom_check', label: 'Validate Zoom config', durationMs: 600, message: 'Zoom credentials verified. Sample transcript loaded.' },
    { id: 'jira_check', label: 'Validate Jira config', durationMs: 500, message: 'Jira site reachable. Project KVT accessible.' },
    { id: 'slack_check', label: 'Validate Slack config', durationMs: 400, message: 'Slack workspace connected. #jira-updates accessible.' },
    { id: 'transcript', label: 'Ingest sample transcript', durationMs: 800, message: 'Transcript fetched (4,820 chars). Meeting: "Q4 Sprint Planning".' },
    { id: 'ai_extract', label: 'AI extraction', durationMs: 2200, message: 'Extracted 7 action items, 3 decisions, 2 risks. Avg confidence: 91%.' },
    { id: 'jira_draft', label: 'Generate Jira drafts', durationMs: 600, message: '7 ticket drafts created. 6 auto-approved (confidence ≥ 85%). 1 flagged for review.' },
    { id: 'jira_create', label: 'Create Jira tickets', durationMs: 1400, message: 'Created KVT-042, KVT-043, KVT-044, KVT-045, KVT-046, KVT-047. 1 held for review.' },
    { id: 'slack_notify', label: 'Send Slack notification', durationMs: 700, message: 'Posted summary to #jira-updates. 3 assignees mentioned.' },
    { id: 'audit', label: 'Write audit log', durationMs: 300, message: 'Workflow run saved. 8 audit entries written.' },
  ];

  for (const step of steps) {
    onStep({ id: step.id, label: step.label, status: 'running' });
    await delay(step.durationMs);
    onStep({ id: step.id, label: step.label, status: 'passed', message: step.message, duration: step.durationMs });
  }
}

export const MOCK_MEETINGS: MeetingRecord[] = [
  { id: '1', title: 'Q4 Sprint Architecture Review', host: 'Sarah Chen', attendees: ['Marcus Johnson', 'Priya Nair', 'Tom Walsh'], date: '2023-10-24', duration: 45, source: 'zoom_webhook', status: 'slack_notified', jiraCount: 5 },
  { id: '2', title: 'Internal Security Audit Sync', host: 'Alex Rivera', attendees: ['Dana Park', 'Chris Lee'], date: '2023-10-23', duration: 72, source: 'zoom_webhook', status: 'ai_analyzed', jiraCount: 0 },
  { id: '3', title: 'Design Feedback: Mobile UX', host: 'Priya Nair', attendees: ['Sarah Chen', 'Tom Walsh', 'Anika Rao'], date: '2023-10-23', duration: 22, source: 'zoom_webhook', status: 'slack_notified', jiraCount: 3 },
  { id: '4', title: 'Client Delivery Review — RetailEdge', host: 'Marcus Johnson', attendees: ['Sarah Chen', 'Client Team'], date: '2023-10-22', duration: 58, source: 'zoom_webhook', status: 'slack_notified', jiraCount: 7 },
  { id: '5', title: 'Sprint 4 Planning Session', host: 'Sarah Chen', attendees: ['Full Team'], date: '2023-10-21', duration: 65, source: 'manual', status: 'slack_notified', jiraCount: 6 },
];

export const MOCK_AUDIT: AuditEntry[] = [
  { id: '1', action: 'integration.test', entityType: 'jira', details: 'Test connection passed — kuvantatech.atlassian.net', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', action: 'integration.save', entityType: 'slack', details: 'Slack bot token updated for workspace KuvantaTech', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', action: 'workflow.run', entityType: 'meeting', details: 'End-to-end sample test passed (9/9 steps)', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', action: 'jira.create', entityType: 'ticket', details: 'Created KVT-041..KVT-047 from "Client Delivery Review"', timestamp: new Date(Date.now() - 172800000).toISOString() },
  { id: '5', action: 'slack.notify', entityType: 'notification', details: 'Posted to #jira-updates — 7 tickets, 2 mentions', timestamp: new Date(Date.now() - 172900000).toISOString() },
];

export function statusColor(status: MeetingRecord['status']): string {
  const map: Record<string, string> = {
    received: '#64748b',
    transcript_fetched: '#3b82f6',
    ai_analyzed: '#f59e0b',
    jira_created: '#8b5cf6',
    slack_notified: '#22c55e',
    failed: '#ef4444',
  };
  return map[status] ?? '#64748b';
}

export function statusLabel(status: MeetingRecord['status']): string {
  const map: Record<string, string> = {
    received: 'Received',
    transcript_fetched: 'Transcript Ready',
    ai_analyzed: 'AI Analyzed',
    jira_created: 'Jira Created',
    slack_notified: 'Complete',
    failed: 'Failed',
  };
  return map[status] ?? status;
}
