import type { Conversation, Message, ActivityLog } from './types';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    channel: 'whatsapp',
    customer_name: 'Sarah Johnson',
    customer_avatar: 'SJ',
    last_message: 'Can I get a bulk discount for 50+ licenses?',
    status: 'open',
    unread_count: 2,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    channel: 'instagram',
    customer_name: 'Mike Chen',
    customer_avatar: 'MC',
    last_message: 'Looking for product availability',
    status: 'open',
    unread_count: 1,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    channel: 'email',
    customer_name: 'Lisa Anderson',
    customer_avatar: 'LA',
    last_message: 'Request for bulk order discount',
    status: 'open',
    unread_count: 0,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    channel: 'website',
    customer_name: 'Tom Wilson',
    customer_avatar: 'TW',
    last_message: 'Technical support needed',
    status: 'pending',
    unread_count: 3,
    created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    channel: 'facebook',
    customer_name: 'Emma Davis',
    customer_avatar: 'ED',
    last_message: 'Shipping inquiry',
    status: 'open',
    unread_count: 0,
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    channel: 'telegram',
    customer_name: 'James Park',
    customer_avatar: 'JP',
    last_message: 'How do I reset my account password?',
    status: 'closed',
    unread_count: 0,
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    channel: 'whatsapp',
    customer_name: 'Priya Sharma',
    customer_avatar: 'PS',
    last_message: 'Thanks for the quick response!',
    status: 'closed',
    unread_count: 0,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', conversation_id: '1', content: "Hi! I'm interested in your premium plan pricing.", direction: 'inbound', created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
    { id: 'm2', conversation_id: '1', content: "Hello! I'd be happy to help you with pricing information.", direction: 'outbound', created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString() },
    { id: 'm3', conversation_id: '1', content: "What's the difference between standard and premium?", direction: 'inbound', created_at: new Date(Date.now() - 6 * 60 * 1000).toISOString() },
    { id: 'm4', conversation_id: '1', content: "Great question! The premium plan includes advanced analytics, priority support, and custom integrations.", direction: 'outbound', created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: 'm5', conversation_id: '1', content: "Can I get a bulk discount for 50+ licenses?", direction: 'inbound', created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
  ],
  '2': [
    { id: 'm6', conversation_id: '2', content: "Hey, do you have the XR Series in stock?", direction: 'inbound', created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
    { id: 'm7', conversation_id: '2', content: "Hi Mike! Let me check our current inventory for you.", direction: 'outbound', created_at: new Date(Date.now() - 9 * 60 * 1000).toISOString() },
    { id: 'm8', conversation_id: '2', content: "Looking for product availability", direction: 'inbound', created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  ],
  '3': [
    { id: 'm9', conversation_id: '3', content: "Good morning, we are placing a large order and would like to discuss bulk pricing.", direction: 'inbound', created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    { id: 'm10', conversation_id: '3', content: "Request for bulk order discount", direction: 'inbound', created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString() },
  ],
  '4': [
    { id: 'm11', conversation_id: '4', content: "I'm getting an error when trying to connect the API.", direction: 'inbound', created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    { id: 'm12', conversation_id: '4', content: "I'd be happy to help. Can you share the error message?", direction: 'outbound', created_at: new Date(Date.now() - 28 * 60 * 1000).toISOString() },
    { id: 'm13', conversation_id: '4', content: "Technical support needed", direction: 'inbound', created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
  ],
  '5': [
    { id: 'm14', conversation_id: '5', content: "Shipping inquiry", direction: 'inbound', created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  ],
  '6': [
    { id: 'm15', conversation_id: '6', content: "How do I reset my account password?", direction: 'inbound', created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString() },
    { id: 'm16', conversation_id: '6', content: "You can reset it at settings > security > change password.", direction: 'outbound', created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
    { id: 'm17', conversation_id: '6', content: "Got it, thank you!", direction: 'inbound', created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
  ],
  '7': [
    { id: 'm18', conversation_id: '7', content: "Thanks for the quick response!", direction: 'inbound', created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  ],
};

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'l1', log_type: 'message', description: 'Inbound message received from Sarah Johnson via WhatsApp', status: 'success', metadata: { channel: 'whatsapp', customer: 'Sarah Johnson' }, created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
  { id: 'l2', log_type: 'reply', description: 'Reply sent to Mike Chen via Instagram', status: 'success', metadata: { channel: 'instagram', customer: 'Mike Chen' }, created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString() },
  { id: 'l3', log_type: 'integration', description: 'WhatsApp integration health check passed', status: 'success', metadata: { channel: 'whatsapp', latency: 142 }, created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: 'l4', log_type: 'test', description: 'Website Chat integration test failed — webhook unreachable', status: 'failure', metadata: { channel: 'website', error: 'Connection timeout' }, created_at: new Date(Date.now() - 22 * 60 * 1000).toISOString() },
  { id: 'l5', log_type: 'ai_config', description: 'RAG settings updated — model changed to GPT-4 Turbo', status: 'success', metadata: { source_type: 'rag', model: 'gpt-4-turbo' }, created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString() },
  { id: 'l6', log_type: 'message', description: 'Inbound message received from Lisa Anderson via Email', status: 'success', metadata: { channel: 'email', customer: 'Lisa Anderson' }, created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
  { id: 'l7', log_type: 'ai_config', description: 'PDF documents uploaded to knowledge base (3 files)', status: 'success', metadata: { source_type: 'pdf', file_count: 3 }, created_at: new Date(Date.now() - 55 * 60 * 1000).toISOString() },
  { id: 'l8', log_type: 'integration', description: 'Facebook integration disconnected — token expired', status: 'warning', metadata: { channel: 'facebook', reason: 'Token expired' }, created_at: new Date(Date.now() - 70 * 60 * 1000).toISOString() },
  { id: 'l9', log_type: 'access', description: 'Admin login from 192.168.1.45', status: 'success', metadata: { ip: '192.168.1.45', role: 'admin' }, created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
  { id: 'l10', log_type: 'reply', description: 'Auto-reply triggered for Tom Wilson via Website Chat', status: 'success', metadata: { channel: 'website', customer: 'Tom Wilson', auto: true }, created_at: new Date(Date.now() - 110 * 60 * 1000).toISOString() },
];

export function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
