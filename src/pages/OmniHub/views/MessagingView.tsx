import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Globe, Send, Tag, ChevronDown } from 'lucide-react';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, timeAgo } from '../mockData';
import type { Conversation, Message, ChannelId } from '../types';

const CHANNELS: { id: ChannelId | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Channels', icon: <MessageSquare size={14} /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <Phone size={14} /> },
  { id: 'instagram', label: 'Instagram', icon: <Tag size={14} /> },
  { id: 'facebook', label: 'Facebook', icon: <Tag size={14} /> },
  { id: 'email', label: 'Email', icon: <Mail size={14} /> },
  { id: 'website', label: 'Website', icon: <Globe size={14} /> },
];

const CHANNEL_COLORS: Record<ChannelId, string> = {
  whatsapp: '#22c55e',
  instagram: '#e1306c',
  facebook: '#1877f2',
  telegram: '#0088cc',
  email: '#f59e0b',
  website: '#8b5cf6',
};

const STATUS_TABS = ['All', 'Active', 'Pending'];

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export const MessagingView = () => {
  const [activeChannel, setActiveChannel] = useState<ChannelId | 'all'>('all');
  const [statusTab, setStatusTab] = useState('All');
  const [selectedConv, setSelectedConv] = useState<Conversation>(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES['1'] ?? []);
  const [draft, setDraft] = useState('');
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({ ...MOCK_MESSAGES });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filtered = MOCK_CONVERSATIONS.filter(c => {
    if (activeChannel !== 'all' && c.channel !== activeChannel) return false;
    if (statusTab === 'Active' && c.status !== 'open') return false;
    if (statusTab === 'Pending' && c.status !== 'pending') return false;
    return true;
  });

  const handleSelectConv = (conv: Conversation) => {
    setSelectedConv(conv);
    setMessages(localMessages[conv.id] ?? []);
    setDraft('');
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversation_id: selectedConv.id,
      content: draft.trim(),
      direction: 'outbound',
      created_at: new Date().toISOString(),
    };
    const updated = [...(localMessages[selectedConv.id] ?? []), newMsg];
    setLocalMessages(prev => ({ ...prev, [selectedConv.id]: updated }));
    setMessages(updated);
    setDraft('');
  };

  const channelCounts: Record<string, number> = {};
  MOCK_CONVERSATIONS.forEach(c => {
    channelCounts[c.channel] = (channelCounts[c.channel] ?? 0) + c.unread_count;
  });
  const totalUnread = MOCK_CONVERSATIONS.reduce((s, c) => s + c.unread_count, 0);

  return (
    <div style={{ marginTop: -8 }}>
      <h1 className="oh-page-title">Unified Messaging</h1>
      <p className="oh-page-sub" style={{ marginBottom: 16 }}>All channels in one place</p>
      <div className="oh-msg-root">
        <div className="oh-msg-sidebar">
          <div className="oh-msg-sidebar__top">
            <div className="oh-msg-tabs">
              {STATUS_TABS.map(t => (
                <button key={t} className={`oh-msg-tab${statusTab === t ? ' oh-msg-tab--active' : ''}`} onClick={() => setStatusTab(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="oh-channel-list">
              {CHANNELS.map(ch => {
                const count = ch.id === 'all' ? totalUnread : (channelCounts[ch.id] ?? 0);
                return (
                  <button
                    key={ch.id}
                    className={`oh-channel-btn${activeChannel === ch.id ? ' oh-channel-btn--active' : ''}`}
                    onClick={() => setActiveChannel(ch.id as ChannelId | 'all')}
                  >
                    {ch.icon}
                    {ch.label}
                    {count > 0 && <span className="oh-channel-btn__count">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="oh-conv-list">
            {filtered.map(conv => (
              <div
                key={conv.id}
                className={`oh-conv-item${selectedConv?.id === conv.id ? ' oh-conv-item--active' : ''}`}
                onClick={() => handleSelectConv(conv)}
              >
                <div className="oh-conv-item__top">
                  <div className="oh-conv-avatar">
                    {conv.customer_avatar}
                    <div className="oh-conv-avatar__channel">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHANNEL_COLORS[conv.channel], display: 'block' }} />
                    </div>
                  </div>
                  <span className="oh-conv-item__name">{conv.customer_name}</span>
                  <span className="oh-conv-item__time">{timeAgo(conv.updated_at)}</span>
                  {conv.unread_count > 0 && (
                    <span className="oh-unread-badge">{conv.unread_count}</span>
                  )}
                </div>
                <div className="oh-conv-item__preview">{conv.last_message}</div>
                <div className="oh-conv-item__channel-tag" style={{ color: CHANNEL_COLORS[conv.channel] }}>
                  {conv.channel.charAt(0).toUpperCase() + conv.channel.slice(1)}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
                No conversations found
              </div>
            )}
          </div>
        </div>

        <div className="oh-chat-panel">
          {selectedConv ? (
            <>
              <div className="oh-chat-header">
                <div className="oh-conv-avatar">
                  {selectedConv.customer_avatar}
                </div>
                <div className="oh-chat-header__info">
                  <div className="oh-chat-header__name">{selectedConv.customer_name}</div>
                  <div className="oh-chat-header__meta">
                    <span style={{ color: CHANNEL_COLORS[selectedConv.channel], textTransform: 'capitalize' }}>
                      {selectedConv.channel}
                    </span>
                    •
                    <span>Online</span>
                  </div>
                </div>
                <span className={`oh-chat-status oh-chat-status--${selectedConv.status}`}>
                  {selectedConv.status}
                </span>
                <div className="oh-chat-actions">
                  <button className="oh-chat-action-btn">
                    <Tag size={12} style={{ display: 'inline', marginRight: 4 }} />Tag
                  </button>
                  <button className="oh-chat-action-btn">
                    <ChevronDown size={12} style={{ display: 'inline', marginRight: 4 }} />Close
                  </button>
                </div>
              </div>

              <div className="oh-chat-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={`oh-msg-bubble oh-msg-bubble--${msg.direction}`}>
                    <div className="oh-msg-bubble__content">{msg.content}</div>
                    <div className="oh-msg-bubble__time">{formatTime(msg.created_at)}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="oh-composer">
                <textarea
                  className="oh-composer-input"
                  placeholder="Type your message…"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  rows={1}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <button className="oh-composer-send" onClick={handleSend} disabled={!draft.trim()}>
                  <Send size={16} color="#fff" />
                </button>
              </div>
            </>
          ) : (
            <div className="oh-chat-empty">
              <MessageSquare size={40} color="#1e3a5f" />
              Select a conversation to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
