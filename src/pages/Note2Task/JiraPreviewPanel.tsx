import { Check, Zap, ExternalLink } from 'lucide-react';
import type { ExtractedTask } from './sampleData';

interface Props {
  tasks: ExtractedTask[];
  synced: boolean;
  onSync: () => void;
  onApproveAll: () => void;
}

const PRIORITY_DOT: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

const TYPE_ICON: Record<string, string> = {
  Bug: '🐛',
  Story: '📖',
  Task: '✅',
  'Sub-task': '↩',
};

export const JiraPreviewPanel = ({ tasks, synced, onSync, onApproveAll }: Props) => {
  const approvedCount = tasks.filter(t => t.status === 'Approved').length;
  const PROJECT_KEY = 'KVT';

  return (
    <div className="jira-panel">
      <div className="jira-panel__header">
        <div className="jira-panel__header-left">
          <div className="jira-panel__project">
            <div className="jira-panel__project-icon">KVT</div>
            <div>
              <p className="jira-panel__project-name">KuvantaTech</p>
              <p className="jira-panel__project-sub">Software Project</p>
            </div>
          </div>
        </div>
        <div className="jira-panel__header-right">
          {synced ? (
            <div className="jira-synced">
              <Check size={14} />
              <span>{tasks.length} issues synced to Jira</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="n2t-btn n2t-btn--ghost" onClick={onApproveAll}>
                Approve All ({tasks.length - approvedCount} remaining)
              </button>
              <button className="n2t-btn n2t-btn--primary" onClick={onSync} disabled={synced}>
                <Zap size={14} />
                Sync {approvedCount > 0 ? approvedCount : tasks.length} Issues to Jira
              </button>
            </div>
          )}
        </div>
      </div>

      {synced && (
        <div className="jira-success-banner">
          <Check size={16} color="#4ade80" />
          <span>All {tasks.length} issues have been created in Jira project <strong>{PROJECT_KEY}</strong>. This is a simulated sync — connect your Jira API key to enable live sync.</span>
        </div>
      )}

      <div className="jira-table-wrap">
        <table className="jira-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Key</th>
              <th>Summary</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Due</th>
              <th>Labels</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className={`jira-table__row${task.status === 'Approved' ? ' jira-table__row--approved' : ''}`}>
                <td>
                  <span className="jira-type-icon" title={task.issueType}>
                    {TYPE_ICON[task.issueType]}
                  </span>
                </td>
                <td>
                  <span className="jira-key">
                    {PROJECT_KEY}-{task.id.replace('N2T-', '')}
                    {synced && <ExternalLink size={11} style={{ marginLeft: 4, opacity: 0.5 }} />}
                  </span>
                </td>
                <td>
                  <span className="jira-summary">{task.summary}</span>
                </td>
                <td>
                  <div className="jira-assignee">
                    <div className="jira-assignee__avatar">
                      {task.assignee.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span>{task.assignee.split(' ')[0]}</span>
                  </div>
                </td>
                <td>
                  <div className="jira-priority">
                    <span className="jira-priority__dot" style={{ background: PRIORITY_DOT[task.priority] }} />
                    {task.priority}
                  </div>
                </td>
                <td>
                  <span className="jira-date">{new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </td>
                <td>
                  <div className="jira-labels">
                    {task.labels.slice(0, 2).map(l => (
                      <span key={l} className="jira-label">{l}</span>
                    ))}
                    {task.labels.length > 2 && <span className="jira-label jira-label--more">+{task.labels.length - 2}</span>}
                  </div>
                </td>
                <td>
                  <span className={`jira-status jira-status--${task.status.toLowerCase()}`}>
                    {synced ? 'Created' : task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="jira-panel__footer">
        <span className="jira-panel__footer-note">
          Fields: Issue Type · Project Key ({PROJECT_KEY}) · Summary · Assignee · Priority · Labels · Due Date · Description
        </span>
      </div>
    </div>
  );
};
