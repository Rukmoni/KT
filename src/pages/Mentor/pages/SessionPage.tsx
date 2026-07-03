import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useMentorChat } from '../hooks/useMentorChat';
import { useConversations } from '../hooks/useConversations';
import { useActivityLog } from '../hooks/useActivityLog';
import { useMentorContext } from '../MentorContext';
import { ChatMessage as ChatMessageComp } from '../components/ChatMessage';
import { StatusPill } from '../components/StatusPill';
import { TokenMeterShadow } from '../components/TokenMeterShadow';
import { EmptyState } from '../components/EmptyState';
import { SUBJECT_MAP } from '../constants';
import type { SubjectCode } from '../types';

export function SessionPage() {
  const { subjectCode } = useParams<{ subjectCode?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { appUserId, setActiveConversationId, refreshConversations, openSidebar } = useMentorContext();

  const locationState = location.state as { initialPrompt?: string; conversationId?: string } | null;
  const resolvedCode = (subjectCode as SubjectCode) ?? null;
  const subject = resolvedCode ? SUBJECT_MAP[resolvedCode] : null;

  const [conversationId, setConversationId] = useState<string | null>(
    locationState?.conversationId ?? null
  );
  const [msgCountRef, setMsgCountRef] = useState(0);

  const {
    messages,
    mode,
    isLoading,
    error,
    lastUsage,
    totalCost,
    totalTokens,
    sendMessage,
    loadMessages,
    clearMessages,
  } = useMentorChat({ sessionToken: appUserId, subjectCode: resolvedCode });

  const { createConversation, updateConversation, loadMessages: loadDbMessages, saveMessages } =
    useConversations(appUserId);
  const { logEvent } = useActivityLog(appUserId);

  // Sync active conversation into context so sidebar highlights it
  useEffect(() => {
    setActiveConversationId(conversationId);
  }, [conversationId, setActiveConversationId]);

  // Load existing conversation on mount
  useEffect(() => {
    const convId = locationState?.conversationId;
    if (!convId) return;
    loadDbMessages(convId).then((msgs) => {
      if (msgs.length) {
        loadMessages(msgs);
        setMsgCountRef(msgs.length);
      }
    });
    window.history.replaceState({}, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial prompt from landing page
  useEffect(() => {
    if (locationState?.initialPrompt && !locationState.conversationId) {
      handleSendText(locationState.initialPrompt);
      window.history.replaceState({}, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendText = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      setShowMenu(false);

      const userMsgIndex = messages.length;
      const assistantMsg = await sendMessage(text);
      if (!assistantMsg) return;

      const userMsg = { role: 'user' as const, content: text };
      const newPair = [userMsg, assistantMsg];

      let convId = conversationId;
      if (!convId) {
        const title = text.slice(0, 60) + (text.length > 60 ? '…' : '');
        convId = await createConversation(title, resolvedCode, mode);
        if (convId) {
          setConversationId(convId);
          const allMsgs = messages.slice(0, userMsgIndex).concat(newPair);
          await saveMessages(convId, allMsgs);
          setMsgCountRef(allMsgs.length);
          refreshConversations();
        }
      } else {
        await saveMessages(convId, newPair);
        const newCount = msgCountRef + 2;
        setMsgCountRef(newCount);
        await updateConversation(convId, { last_mode: mode, message_count: newCount });
        refreshConversations();
      }

      await logEvent({ event_type: 'message', subject_code: resolvedCode });
    },
    [
      messages,
      isLoading,
      sendMessage,
      conversationId,
      mode,
      resolvedCode,
      createConversation,
      saveMessages,
      updateConversation,
      logEvent,
      msgCountRef,
      refreshConversations,
    ]
  );

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await handleSendText(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleNewConversation() {
    clearMessages();
    setConversationId(null);
    setMsgCountRef(0);
  }

  const QUICK_ACTIONS = [
    { label: '📖 Teach me a chapter', text: 'Teach me a chapter' },
    { label: '📝 Test me', text: 'Test me on this topic' },
    { label: '🃏 Flashcards', text: 'Give me flashcards for this topic' },
    { label: '⚡ Rapid Fire', text: 'Rapid fire round on this subject' },
    { label: '📊 PYQ Analysis', text: 'Show me PYQ analysis for this topic' },
    { label: '💪 Strengthen', text: 'Strengthen my weak areas' },
    { label: '🏠 Main Menu', text: 'Show me the main menu' },
  ];

  return (
    <div className="flex flex-col h-full bg-mentor-cream">
      {/* Header */}
      <header className="flex-shrink-0 bg-mentor-navy px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile: open sidebar */}
          <button
            onClick={openSidebar}
            className="md:hidden text-mentor-tan-light hover:text-mentor-cream transition-colors text-xl leading-none flex-shrink-0"
            aria-label="Open history"
          >
            ☰
          </button>
          {/* Desktop: back to home */}
          <button
            onClick={() => navigate('/mentor')}
            className="hidden md:block text-mentor-tan-light hover:text-mentor-cream transition-colors text-lg flex-shrink-0"
            aria-label="Home"
          >
            ←
          </button>
          <div className="w-8 h-8 rounded-full bg-mentor-amber flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            M
          </div>
          <div className="min-w-0">
            <h1 className="text-mentor-cream font-semibold text-sm leading-tight truncate">
              {subject ? `${subject.icon} ${subject.name}` : 'Board Exam Mentor'}
            </h1>
            <p className="text-mentor-tan-light text-xs">
              {conversationId ? 'Saved thread' : "Sahana's Study Partner"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusPill mode={mode} />
          {messages.length > 0 && (
            <button
              onClick={handleNewConversation}
              className="text-xs text-mentor-tan-light hover:text-mentor-cream transition-colors ml-1 px-2 py-1 rounded border border-mentor-border hover:border-mentor-cream"
              title="New conversation"
            >
              + New
            </button>
          )}
        </div>
      </header>

      {/* Token Meter */}
      {totalTokens > 0 && (
        <div className="flex-shrink-0 flex justify-end px-4 py-1.5 bg-mentor-cream border-b border-mentor-border">
          <TokenMeterShadow
            totalCost={totalCost}
            totalTokens={totalTokens}
            cacheHit={lastUsage?.cache_hit}
            lastCost={lastUsage?.cost_usd_estimate}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <EmptyState
            icon="🎓"
            title="Ready to study, Sahana!"
            description="Ask me anything — a topic, a test, flashcards, PYQ analysis, or just say 'hi'."
            action={{ label: 'Show Main Menu', onClick: () => handleSendText('Show me the main menu') }}
          />
        ) : (
          messages.map((msg, i) => (
            <ChatMessageComp key={i} message={msg} isLatest={i === messages.length - 1} />
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-mentor-navy flex items-center justify-center text-mentor-cream text-sm font-bold flex-shrink-0 mt-1 mr-3">
              M
            </div>
            <div className="bg-mentor-surface border border-mentor-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-2 h-2 rounded-full bg-mentor-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-mentor-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-mentor-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md p-4 bg-mentor-red-pale border border-red-200 rounded-xl text-sm text-mentor-red">
            <span className="font-medium">⚠ Error: </span>{error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Actions Panel */}
      {showMenu && (
        <div className="flex-shrink-0 border-t border-mentor-border bg-mentor-surface px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.text}
                onClick={() => { setInput(''); setShowMenu(false); handleSendText(a.text); }}
                className="text-xs px-3 py-1.5 rounded-full bg-mentor-cream border border-mentor-border text-mentor-text hover:bg-mentor-cream-dark hover:border-mentor-navy transition-colors"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 border-t border-mentor-border bg-mentor-surface px-4 py-3">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className={`flex-shrink-0 w-9 h-9 rounded-full border transition-colors flex items-center justify-center text-base ${
              showMenu
                ? 'bg-mentor-navy text-mentor-cream border-mentor-navy'
                : 'bg-mentor-cream border-mentor-border text-mentor-muted hover:border-mentor-navy hover:text-mentor-navy'
            }`}
            title="Quick actions"
          >
            ⚡
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything — topic, test, flashcards, PYQ…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-mentor-border bg-mentor-cream px-4 py-2.5 text-sm text-mentor-text placeholder-mentor-muted focus:outline-none focus:border-mentor-navy transition-colors leading-relaxed max-h-32 overflow-y-auto"
            style={{ minHeight: '42px' }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 128) + 'px';
            }}
          />

          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-mentor-navy text-mentor-cream flex items-center justify-center transition-all hover:bg-mentor-navy-light disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-mentor-muted text-center mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
