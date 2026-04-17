export type ChannelId = 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'email' | 'website';
export type ConversationStatus = 'open' | 'pending' | 'closed';
export type IntegrationStatus = 'connected' | 'warning' | 'error' | 'disconnected';
export type AiSourceStatus = 'active' | 'pending' | 'inactive' | 'failed';
export type LogType = 'message' | 'reply' | 'integration' | 'ai_config' | 'test' | 'access';
export type LogStatus = 'success' | 'failure' | 'warning';
export type MessageDirection = 'inbound' | 'outbound';

export interface Conversation {
  id: string;
  channel: ChannelId;
  customer_name: string;
  customer_avatar: string;
  last_message: string;
  status: ConversationStatus;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  direction: MessageDirection;
  created_at: string;
}

export interface Integration {
  id: string;
  channel: ChannelId;
  enabled: boolean;
  status: IntegrationStatus;
  config: Record<string, string | number | boolean>;
  last_tested_at: string | null;
  test_result: string;
  created_at: string;
  updated_at: string;
}

export interface AiSource {
  id: string;
  source_type: string;
  label: string;
  description: string;
  status: AiSourceStatus;
  config: Record<string, string | number | boolean | string[]>;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  log_type: LogType;
  description: string;
  status: LogStatus;
  metadata: Record<string, string | number | boolean>;
  created_at: string;
}
