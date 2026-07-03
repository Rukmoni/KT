import { useNavigate } from 'react-router-dom';
import { useMentorContext } from '../MentorContext';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUBJECT_MAP } from '../constants';
import type { Conversation } from '../types';

function groupByDate(convs: Conversation[]) {
  const order: string[] = [];
  const map: Record<string, Conversation[]> = {};

  for (const conv of convs) {
    const date = new Date(conv.updated_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let label: string;
    if (date.toDateString() === today.toDateString()) label = 'Today';
    else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    if (!map[label]) {
      map[label] = [];
      order.push(label);
    }
    map[label].push(conv);
  }

  return order.map((label) => ({ label, items: map[label] }));
}

interface ConversationSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function ConversationSidebar({ open, onClose }: ConversationSidebarProps) {
  const navigate = useNavigate();
  const { appUserId, conversations, activeConversationId, setActiveConversationId, refreshConversations } =
    useMentorContext();

  const groups = groupByDate(conversations);

  function handleSelect(conv: Conversation) {
    setActiveConversationId(conv.id);
    const path = conv.subject_code ? `/mentor/session/${conv.subject_code}` : '/mentor/session';
    navigate(path, { state: { conversationId: conv.id } });
    onClose();
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;

    const params = new URLSearchParams({ session_token: appUserId });
    await fetch(`${SUPABASE_URL}/functions/v1/mentor-conversations/${id}?${params}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Apikey: SUPABASE_ANON_KEY,
      },
    });

    if (activeConversationId === id) {
      setActiveConversationId(null);
      navigate('/mentor');
    }
    refreshConversations();
  }

  function handleNewChat() {
    setActiveConversationId(null);
    navigate('/mentor/session');
    onClose();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 w-64 bg-mentor-navy flex flex-col',
          'transition-transform duration-300 ease-in-out',
          'md:static md:translate-x-0 md:z-auto md:flex-shrink-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => { navigate('/mentor'); onClose(); }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-mentor-amber flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                M
              </div>
              <span className="text-mentor-cream font-semibold text-sm">Sahana's Mentor</span>
            </button>
            <button
              onClick={onClose}
              className="md:hidden text-mentor-tan-light hover:text-mentor-cream text-xl leading-none px-1"
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/20 text-mentor-cream text-sm hover:bg-white/10 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.length === 0 ? (
            <p className="text-mentor-tan-light/60 text-xs text-center py-10 px-4 leading-relaxed">
              No conversations yet.
              <br />Start a session to see your history here.
            </p>
          ) : (
            groups.map(({ label, items }) => (
              <div key={label} className="mb-1">
                <div className="px-4 py-1">
                  <span className="text-mentor-tan-light/50 text-[10px] font-semibold uppercase tracking-widest">
                    {label}
                  </span>
                </div>
                {items.map((conv) => {
                  const subject = conv.subject_code ? SUBJECT_MAP[conv.subject_code] : null;
                  const isActive = conv.id === activeConversationId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelect(conv)}
                      className={[
                        'group flex items-center gap-2 px-3 py-2 mx-1 rounded-lg cursor-pointer transition-colors',
                        isActive ? 'bg-white/15' : 'hover:bg-white/10',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'w-6 h-6 rounded-full flex items-center justify-center text-[11px] flex-shrink-0',
                          subject ? subject.bgColor : 'bg-white/20',
                        ].join(' ')}
                      >
                        {subject ? subject.icon : '💬'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-mentor-cream text-xs font-medium truncate leading-snug">
                          {conv.title}
                        </p>
                        <p className="text-mentor-tan-light/50 text-[10px] mt-0.5">
                          {conv.message_count} msg{conv.message_count !== 1 ? 's' : ''} ·{' '}
                          {new Date(conv.updated_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[10px] text-mentor-tan-light/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded"
                        title="Delete conversation"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-white/10 px-3 py-3 space-y-0.5">
          <button
            onClick={() => { navigate('/mentor/telemetry'); onClose(); }}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-mentor-tan-light text-xs hover:bg-white/10 transition-colors"
          >
            <span>📊</span> Token Telemetry
          </button>
          <button
            onClick={() => { navigate('/mentor/config'); onClose(); }}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-mentor-tan-light text-xs hover:bg-white/10 transition-colors"
          >
            <span>⚙️</span> Config
          </button>
        </div>
      </aside>
    </>
  );
}
