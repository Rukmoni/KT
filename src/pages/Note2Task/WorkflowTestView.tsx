import { useState } from 'react';
import { Check, X, Loader as Loader2, Play, RotateCcw, ChevronDown, ChevronUp, CircleAlert as AlertCircle, Settings } from 'lucide-react';
import { runSampleWorkflow } from './mockServices';
import type { WorkflowStep } from './mockServices';
import { useIntegrations } from './IntegrationContext';

const STEP_DEFS = [
  { id: 'zoom_check', label: 'Validate Zoom config', desc: 'Check credentials and webhook endpoint.' },
  { id: 'jira_check', label: 'Validate Jira config', desc: 'Verify API token and project access.' },
  { id: 'slack_check', label: 'Validate Slack config', desc: 'Test bot token or webhook URL.' },
  { id: 'transcript', label: 'Ingest sample transcript', desc: 'Load sample meeting and fetch transcript.' },
  { id: 'ai_extract', label: 'AI extraction', desc: 'Run LLM analysis — extract tasks, decisions, risks.' },
  { id: 'jira_draft', label: 'Generate Jira drafts', desc: 'Map extracted tasks to Jira issue drafts.' },
  { id: 'jira_create', label: 'Create Jira tickets', desc: 'Post approved tickets to Jira project KVT.' },
  { id: 'slack_notify', label: 'Send Slack notification', desc: 'Post summary to #jira-updates.' },
  { id: 'audit', label: 'Write audit log', desc: 'Persist workflow run and all actions to DB.' },
];

const INTEGRATION_STEPS: Array<{ id: string; integ: 'zoom' | 'jira' | 'slack'; label: string }> = [
  { id: 'zoom_check', integ: 'zoom', label: 'Zoom' },
  { id: 'jira_check', integ: 'jira', label: 'Jira' },
  { id: 'slack_check', integ: 'slack', label: 'Slack' },
];

export const WorkflowTestView = () => {
  const { statuses, checkSingle } = useIntegrations();
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [blockingErrors, setBlockingErrors] = useState<string[]>([]);

  const handleRun = async () => {
    setBlockingErrors([]);
    setValidating(true);

    const errors: string[] = [];
    await Promise.all(
      INTEGRATION_STEPS.map(async ({ integ, label }) => {
        const current = statuses[integ];
        let status = current;
        if (current.status !== 'connected') {
          status = await checkSingle(integ);
        }
        if (status.status !== 'connected') {
          errors.push(`${label}: ${status.message || 'Not connected'}${status.errorDetail ? ` — ${status.errorDetail}` : ''}`);
        }
      })
    );

    setValidating(false);

    if (errors.length > 0) {
      setBlockingErrors(errors);
      return;
    }

    setRunning(true);
    setDone(false);
    setSteps(STEP_DEFS.map(s => ({ id: s.id, label: s.label, status: 'pending' })));

    await runSampleWorkflow((step) => {
      setSteps(prev => prev.map(s => s.id === step.id ? step : s));
    });

    setRunning(false);
    setDone(true);
  };

  const handleReset = () => {
    setSteps([]);
    setDone(false);
    setExpanded(null);
    setBlockingErrors([]);
  };

  const passedCount = steps.filter(s => s.status === 'passed').length;
  const failedCount = steps.filter(s => s.status === 'failed').length;
  const allDone = done && steps.length > 0;
  const allPassed = allDone && failedCount === 0;

  const integrationReady = (id: 'zoom' | 'jira' | 'slack') => statuses[id].status === 'connected';
  const allIntegrationsReady = integrationReady('zoom') && integrationReady('jira') && integrationReady('slack');

  return (
    <div className="wt-root">
      <div className="wt-header">
        <div>
          <h2 className="wt-title">End-to-End Workflow Test</h2>
          <p className="wt-sub">Validates all integrations and runs a complete meeting-to-Jira workflow using a sample transcript.</p>
        </div>
        <div className="wt-header__actions">
          {steps.length > 0 && (
            <button className="wt-btn wt-btn--ghost" onClick={handleReset} disabled={running || validating}>
              <RotateCcw size={14} /> Reset
            </button>
          )}
          <button
            className={`wt-btn wt-btn--primary${(running || validating) ? ' loading' : ''}`}
            onClick={handleRun}
            disabled={running || validating}
          >
            {validating ? <><Loader2 size={14} className="spin" />Validating…</>
              : running ? <><Loader2 size={14} className="spin" />Running…</>
              : <><Play size={14} />Run Sample Workflow</>}
          </button>
        </div>
      </div>

      <div className="wt-integration-status">
        {INTEGRATION_STEPS.map(({ integ, label }) => {
          const s = statuses[integ];
          const color = s.status === 'connected' ? '#22c55e' : s.status === 'error' ? '#ef4444' : s.status === 'checking' ? '#f59e0b' : '#475569';
          return (
            <div key={integ} className={`wt-integ-badge${s.status === 'error' ? ' wt-integ-badge--error' : s.status === 'connected' ? ' wt-integ-badge--ok' : ''}`}>
              {s.status === 'connected' && <Check size={11} color={color} />}
              {s.status === 'error' && <X size={11} color={color} />}
              {(s.status === 'checking') && <Loader2 size={11} className="spin" style={{ color }} />}
              {s.status === 'not_configured' && <AlertCircle size={11} color={color} />}
              <span style={{ color }}>{label}</span>
            </div>
          );
        })}
      </div>

      {!allIntegrationsReady && (
        <div className="wt-prereq-warning">
          <AlertCircle size={14} />
          <div>
            <strong>Integration check required</strong>
            <p>One or more integrations are not confirmed connected. Clicking "Run" will validate them first and block if any fail.</p>
          </div>
        </div>
      )}

      {blockingErrors.length > 0 && (
        <div className="wt-blocking-errors">
          <div className="wt-blocking-errors__header">
            <X size={16} /> Integration validation failed — fix these before running the workflow
          </div>
          <ul className="wt-blocking-errors__list">
            {blockingErrors.map((e, i) => (
              <li key={i}>
                <AlertCircle size={12} /> {e}
              </li>
            ))}
          </ul>
          <button className="wt-btn wt-btn--ghost" onClick={() => Promise.all(INTEGRATION_STEPS.map(s => checkSingle(s.integ))).then(() => setBlockingErrors([]))}>
            <Settings size={13} /> Re-validate All
          </button>
        </div>
      )}

      {allDone && (
        <div className={`wt-result-banner${allPassed ? ' pass' : ' fail'}`}>
          {allPassed ? <Check size={18} /> : <X size={18} />}
          <div>
            <p className="wt-result-title">{allPassed ? 'All steps passed' : `${failedCount} step(s) failed`}</p>
            <p className="wt-result-sub">{passedCount}/{STEP_DEFS.length} steps completed · Workflow {allPassed ? 'PASSED' : 'FAILED'}</p>
          </div>
        </div>
      )}

      <div className="wt-steps">
        {(steps.length ? steps : STEP_DEFS.map(s => ({ id: s.id, label: s.label, status: 'pending' as const, message: undefined, duration: undefined } as WorkflowStep))).map((step, i) => {
          const def = STEP_DEFS[i];
          const isExp = expanded === step.id;
          return (
            <div key={step.id} className={`wt-step${step.status === 'running' ? ' running' : ''}${step.status === 'passed' ? ' passed' : ''}${step.status === 'failed' ? ' failed' : ''}`}>
              <div className="wt-step__left">
                <div className="wt-step__num">
                  {step.status === 'running' && <Loader2 size={14} className="spin" />}
                  {step.status === 'passed' && <Check size={14} />}
                  {step.status === 'failed' && <X size={14} />}
                  {step.status === 'pending' && <span>{i + 1}</span>}
                </div>
                <div className="wt-step__info">
                  <p className="wt-step__label">{step.label}</p>
                  {step.status === 'pending' && <p className="wt-step__desc">{def?.desc}</p>}
                  {step.status === 'running' && <p className="wt-step__desc wt-step__desc--running">Processing…</p>}
                  {step.message && !isExp && (
                    <p className={`wt-step__msg${step.status === 'passed' ? ' pass' : ' fail'}`}>{step.message}</p>
                  )}
                </div>
              </div>
              <div className="wt-step__right">
                {step.duration && <span className="wt-step__dur">{step.duration}ms</span>}
                {step.message && (
                  <button className="wt-expand-btn" onClick={() => setExpanded(isExp ? null : step.id)}>
                    {isExp ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                )}
              </div>
              {isExp && step.message && (
                <div className="wt-step__expanded">
                  <p>{step.message}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="wt-info">
        <p className="wt-info__title">What this test does</p>
        <ul className="wt-info__list">
          <li>Validates all three integrations (Zoom, Jira, Slack) before proceeding</li>
          <li>Uses a pre-loaded sample transcript (no real Zoom call needed)</li>
          <li>Runs AI extraction in mock mode — no OpenAI credits consumed</li>
          <li>Creates a test Jira issue (KVT-TEST) and immediately deletes it</li>
          <li>Posts a test message to the configured Slack channel</li>
          <li>All actions are logged to the audit trail</li>
        </ul>
      </div>
    </div>
  );
};
