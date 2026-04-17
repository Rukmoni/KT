/*
  # KuvantaOmniHub Tables

  1. New Tables
    - `omni_conversations` - stores conversations from all channels
      - id, channel, customer_name, customer_avatar, last_message, status, unread_count, created_at, updated_at
    - `omni_messages` - messages within conversations
      - id, conversation_id, content, direction (inbound/outbound), created_at
    - `omni_integrations` - channel integration config
      - id, channel, enabled, status, config (jsonb), last_tested_at, test_result
    - `omni_ai_sources` - AI knowledge source records
      - id, source_type, label, description, status, config (jsonb), created_at
    - `omni_activity_logs` - audit/activity log entries
      - id, log_type, description, status, metadata (jsonb), created_at

  2. Security
    - RLS enabled on all tables
    - Authenticated users can read/write all omni tables (internal vendor portal)
*/

CREATE TABLE IF NOT EXISTS omni_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  customer_avatar text DEFAULT '',
  last_message text DEFAULT '',
  status text NOT NULL DEFAULT 'open',
  unread_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE omni_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read omni_conversations"
  ON omni_conversations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert omni_conversations"
  ON omni_conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update omni_conversations"
  ON omni_conversations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS omni_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES omni_conversations(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  direction text NOT NULL DEFAULT 'inbound',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE omni_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read omni_messages"
  ON omni_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert omni_messages"
  ON omni_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS omni_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text UNIQUE NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'disconnected',
  config jsonb NOT NULL DEFAULT '{}',
  last_tested_at timestamptz,
  test_result text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE omni_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read omni_integrations"
  ON omni_integrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert omni_integrations"
  ON omni_integrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update omni_integrations"
  ON omni_integrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS omni_ai_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,
  label text NOT NULL DEFAULT '',
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'inactive',
  config jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE omni_ai_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read omni_ai_sources"
  ON omni_ai_sources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert omni_ai_sources"
  ON omni_ai_sources FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update omni_ai_sources"
  ON omni_ai_sources FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS omni_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_type text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'success',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE omni_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read omni_activity_logs"
  ON omni_activity_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert omni_activity_logs"
  ON omni_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Seed default integrations
INSERT INTO omni_integrations (channel, enabled, status, config) VALUES
  ('whatsapp', true, 'connected', '{"apiKey": "", "webhookUrl": "https://api.kuvanta.com/webhooks/whatsapp", "secretToken": "", "maxMessageLength": 4096, "responseTimeout": 30, "readReceipts": true, "autoReply": false, "apiVersion": "v2.0"}'),
  ('instagram', true, 'connected', '{"accessToken": "", "webhookUrl": "https://api.kuvanta.com/webhooks/instagram", "pageId": "", "verifyToken": ""}'),
  ('facebook', false, 'warning', '{"accessToken": "", "webhookUrl": "https://api.kuvanta.com/webhooks/facebook", "pageId": "", "verifyToken": ""}'),
  ('telegram', true, 'connected', '{"botToken": "", "webhookUrl": "https://api.kuvanta.com/webhooks/telegram", "allowedUpdates": "message,callback_query"}'),
  ('email', true, 'connected', '{"smtpHost": "", "smtpPort": 587, "smtpUser": "", "smtpPass": "", "fromEmail": "support@kuvanta.com", "imapHost": "", "imapPort": 993}'),
  ('website', false, 'error', '{"widgetId": "", "primaryColor": "#3B82F6", "position": "bottom-right", "welcomeMessage": "Hi! How can we help?", "offlineMessage": "We are currently offline."}')
ON CONFLICT (channel) DO NOTHING;

-- Seed default AI sources
INSERT INTO omni_ai_sources (source_type, label, description, status, config) VALUES
  ('rag', 'RAG Settings', 'Retrieval-Augmented Generation configuration', 'active', '{"model": "gpt-4-turbo", "temperature": 0.7, "maxTokens": 2048, "topK": 5, "similarityThreshold": 0.75}'),
  ('excel', 'Excel Upload', 'Product catalogs and pricing sheets', 'active', '{"files": [], "autoRefresh": true}'),
  ('pdf', 'PDF Upload', 'Documentation and manuals', 'active', '{"files": [], "chunkSize": 500}'),
  ('website_crawl', 'Website Crawl', 'Scrape knowledge from websites', 'pending', '{"urls": ["https://kuvanta.tech"], "depth": 3, "schedule": "weekly"}'),
  ('database', 'Database Connector', 'Connect to external databases', 'inactive', '{"connectionString": "", "query": "", "refreshInterval": 3600}')
ON CONFLICT DO NOTHING;
