import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '../hooks/useConversations';
import { SUBJECT_MAP } from '../constants';
import type { Conversation } from '../types';

interface HistoryPageProps {
  sessionToken: string;
}

function groupByDate(conversations: Conversation[]) {
  const groups: Record<string, Conversation[]> = {};
  for (const conv of conversations) {
    const date = new Date(conv.updated_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let label: string;
    if (date.toDateString() === today.toDateString()) label = 'Today';
    else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    if (!groups[label]) groups[label] = [];
    groups[label].push(conv);
  }
  return groups;
}

function ConvCard({
  conv,
  onContinue,
  onDelete,
}: {
  conv: Conversation;
  onContinue: (id: string, subjectCode: string | null) => void;
  onDelete: (id: string) => void;
}) {
  const subject = conv.subject_code ? SUBJECT_MAP[conv.subject_code] : null;
  const time = new Date(conv.updated_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-mentor-surface border border-mentor-border rounded-xl px-4 py-3 flex items-center gap-3 group hover:border-mentor-navy transition-colors">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 ${
          subject ? subject.bgColor : 'bg-mentor-cream-dark'
        }`}
      >
        {subject ? subject.icon : '💬'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-mentor-text truncate">{conv.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {subject && (
            <span className={`text-xs font-medium ${subject.color}`}>{subject.shortName}</span>
          )}
          <span className="text-xs text-mentor-muted">
            {conv.message_count} msg{conv.message_count !== 1 ? 's' : ''} · {time}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onContinue(conv.id, conv.subject_code)}
          className="text-xs px-3 py-1.5 rounded-lg bg-mentor-navy text-mentor-cream hover:bg-mentor-navy-light transition-colors"
        >
          Continue
        </button>
        <button
          onClick={() => onDelete(conv.id)}
          className="text-xs px-2 py-1.5 rounded-lg text-mentor-muted hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Delete conversation"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function HistoryPage({ sessionToken }: HistoryPageProps) {
  const navigate = useNavigate();
  const { conversations, loading, loadConversations, deleteConversation } =
    useConversations(sessionToken);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  function handleContinue(conversationId: string, subjectCode: string | null) {
    const path = subjectCode ? `/mentor/session/${subjectCode}` : '/mentor/session';
    navigate(path, { state: { conversationId } });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this conversation?')) return;
    await deleteConversation(id);
  }

  const groups = groupByDate(conversations);

  return (
    <div className="min-h-screen bg-mentor-cream">
      <header className="bg-mentor-navy px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/mentor')}
          className="text-mentor-tan-light hover:text-mentor-cream transition-colors text-lg"
        >
          ←
        </button>
        <h1 className="text-mentor-cream font-semibold text-base">Study History</h1>
        <button
          onClick={() => navigate('/mentor/session')}
          className="ml-auto text-xs px-3 py-1.5 rounded-lg bg-mentor-amber text-white hover:bg-amber-500 transition-colors font-medium"
        >
          + New Session
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-sm text-mentor-muted text-center py-12">Loading history…</p>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-mentor-navy font-semibold mb-2">No sessions yet</p>
            <p className="text-sm text-mentor-muted mb-6">
              Start studying and your sessions will appear here.
            </p>
            <button
              onClick={() => navigate('/mentor/session')}
              className="px-6 py-3 bg-mentor-navy text-mentor-cream rounded-xl font-medium hover:bg-mentor-navy-light transition-colors"
            >
              Start First Session
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groups).map(([label, convs]) => (
              <div key={label}>
                <h2 className="text-xs font-semibold text-mentor-muted uppercase tracking-wider mb-2">
                  {label}
                </h2>
                <div className="space-y-2">
                  {convs.map((conv) => (
                    <ConvCard
                      key={conv.id}
                      conv={conv}
                      onContinue={handleContinue}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
