import { useState } from 'react';
import { Check, X, Loader as Loader2, Play, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { runSampleWorkflow } from './mockServices';
import type { WorkflowStep } from './mockServices';

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

export const WorkflowTestView = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleRun = async () => {
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
  };

  const passedCount = steps.filter(s => s.status === 'passed').length;
  const failedCount = steps.filter(s => s.status === 'failed').length;
  const allDone = done && steps.length > 0;
  const allPassed = allDone && failedCount === 0;

  return (
    <div className="wt-root">
      <div className="wt-header">
        <div>
          <h2 className="wt-title">End-to-End Workflow Test</h2>
          <p className="wt-sub">Validates all integrations and runs a complete meeting-to-Jira workflow using a sample transcript.</p>
        </div>
        <div className="wt-header__actions">
          {steps.length > 0 && (
            <button className="wt-btn wt-btn--ghost" onClick={handleReset} disabled={running}>
              <RotateCcw size={14} /> Reset
            </button>
          )}
          <button className={`wt-btn wt-btn--primary${running ? ' loading' : ''}`} onClick={handleRun} disabled={running}>
            {running ? <><Loader2 size={14} className="spin" />Running…</> : <><Play size={14} />Run Sample Workflow</>}
          </button>
        </div>
      </div>

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
