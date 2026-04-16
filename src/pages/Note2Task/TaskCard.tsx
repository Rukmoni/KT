import { useState } from 'react';
import { ChevronDown, ChevronUp, CreditCard as Edit3, Check, X } from 'lucide-react';
import type { ExtractedTask } from './sampleData';

interface Props {
  task: ExtractedTask;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (task: ExtractedTask) => void;
}

const PRIORITY_COLORS: Record<string, { bg: string; color: string }> = {
  Critical: { bg: 'rgba(220,38,38,0.12)', color: '#ef4444' },
  High: { bg: 'rgba(234,88,12,0.12)', color: '#f97316' },
  Medium: { bg: 'rgba(202,138,4,0.12)', color: '#eab308' },
  Low: { bg: 'rgba(22,163,74,0.12)', color: '#22c55e' },
};

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  Bug: { bg: 'rgba(220,38,38,0.10)', color: '#f87171' },
  Story: { bg: 'rgba(37,99,235,0.10)', color: '#60a5fa' },
  Task: { bg: 'rgba(16,185,129,0.10)', color: '#34d399' },
  'Sub-task': { bg: 'rgba(139,92,246,0.10)', color: '#a78bfa' },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Draft: { bg: 'rgba(255,255,255,0.06)', color: '#94a3b8' },
  Ready: { bg: 'rgba(37,99,235,0.12)', color: '#60a5fa' },
  Approved: { bg: 'rgba(22,163,74,0.12)', color: '#4ade80' },
};

export const TaskCard = ({ task, index, isSelected, onSelect, onUpdate }: Props) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...task });

  const pColor = PRIORITY_COLORS[task.priority];
  const tColor = TYPE_COLORS[task.issueType];
  const sStyle = STATUS_STYLES[task.status];

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...task, status: 'Approved' });
  };

  const handleSaveEdit = () => {
    onUpdate(draft);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setDraft({ ...task });
    setEditing(false);
  };

  return (
    <div
      className={`tc-card${isSelected ? ' tc-card--selected' : ''}${task.status === 'Approved' ? ' tc-card--approved' : ''}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="tc-card__header" onClick={onSelect}>
        <div className="tc-card__header-left">
          <span className="tc-id">{task.id}</span>
          <span className="tc-type" style={{ background: tColor.bg, color: tColor.color }}>{task.issueType}</span>
          <span className="tc-priority" style={{ background: pColor.bg, color: pColor.color }}>{task.priority}</span>
        </div>
        <div className="tc-card__header-right">
          <span className="tc-confidence">
            <span className="tc-confidence__bar" style={{ width: `${task.confidence}%` }} />
            {task.confidence}% confidence
          </span>
          <span className="tc-status" style={{ background: sStyle.bg, color: sStyle.color }}>{task.status}</span>
          {task.status !== 'Approved' && (
            <button className="tc-approve-btn" onClick={handleApprove}>
              <Check size={12} />
              Approve
            </button>
          )}
          {isSelected ? <ChevronUp size={15} color="#64748b" /> : <ChevronDown size={15} color="#64748b" />}
        </div>
      </div>

      <div className="tc-card__summary" onClick={onSelect}>
        {task.summary}
      </div>

      {isSelected && (
        <div className="tc-card__body">
          {editing ? (
            <div className="tc-edit-form">
              <div className="tc-edit-row">
                <label>Summary</label>
                <input
                  className="tc-edit-input"
                  value={draft.summary}
                  onChange={e => setDraft(d => ({ ...d, summary: e.target.value }))}
                />
              </div>
              <div className="tc-edit-row">
                <label>Description</label>
                <textarea
                  className="tc-edit-textarea"
                  value={draft.description}
                  onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                />
              </div>
              <div className="tc-edit-row-group">
                <div className="tc-edit-row">
                  <label>Assignee</label>
                  <input
                    className="tc-edit-input"
                    value={draft.assignee}
                    onChange={e => setDraft(d => ({ ...d, assignee: e.target.value }))}
                  />
                </div>
                <div className="tc-edit-row">
                  <label>Due Date</label>
                  <input
                    type="date"
                    className="tc-edit-input"
                    value={draft.dueDate}
                    onChange={e => setDraft(d => ({ ...d, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="tc-edit-actions">
                <button className="tc-btn tc-btn--save" onClick={handleSaveEdit}>
                  <Check size={13} /> Save
                </button>
                <button className="tc-btn tc-btn--cancel" onClick={handleCancelEdit}>
                  <X size={13} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="tc-detail">
              <p className="tc-desc">{task.description}</p>
              <div className="tc-meta-grid">
                <div className="tc-meta-item">
                  <span className="tc-meta-label">Assignee</span>
                  <span className="tc-meta-value">{task.assignee}</span>
                </div>
                <div className="tc-meta-item">
                  <span className="tc-meta-label">Due Date</span>
                  <span className="tc-meta-value">{new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="tc-meta-item">
                  <span className="tc-meta-label">Issue Type</span>
                  <span className="tc-meta-value">{task.issueType}</span>
                </div>
                <div className="tc-meta-item">
                  <span className="tc-meta-label">Priority</span>
                  <span className="tc-meta-value">{task.priority}</span>
                </div>
              </div>
              <div className="tc-labels">
                {task.labels.map(l => (
                  <span key={l} className="tc-label">{l}</span>
                ))}
              </div>
              <button className="tc-edit-trigger" onClick={() => setEditing(true)}>
                <Edit3 size={13} />
                Edit task
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
