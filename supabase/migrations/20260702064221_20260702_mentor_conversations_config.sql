
-- mentor_conversations: persistent study threads
CREATE TABLE IF NOT EXISTS mentor_conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token text NOT NULL,
  title text NOT NULL DEFAULT 'New Session',
  subject_code text,
  last_mode text DEFAULT 'chat',
  message_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE mentor_conversations ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS mentor_conv_session_idx ON mentor_conversations(session_token);
CREATE POLICY "conv_select" ON mentor_conversations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "conv_insert" ON mentor_conversations FOR INSERT TO anon, authenticated WITH CHECK (session_token IS NOT NULL AND length(trim(session_token)) > 5);
CREATE POLICY "conv_update" ON mentor_conversations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "conv_delete" ON mentor_conversations FOR DELETE TO anon, authenticated USING (true);

-- mentor_messages: stored messages per conversation
CREATE TABLE IF NOT EXISTS mentor_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES mentor_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE mentor_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS mentor_msg_conv_idx ON mentor_messages(conversation_id, created_at);
CREATE POLICY "msg_select" ON mentor_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "msg_insert" ON mentor_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "msg_delete" ON mentor_messages FOR DELETE TO anon, authenticated USING (true);

-- mentor_config: single-row global configuration
CREATE TABLE IF NOT EXISTS mentor_config (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  model_primary text DEFAULT 'gemini-2.5-flash',
  model_lite text DEFAULT 'gemini-2.0-flash',
  model_pro text DEFAULT 'gemini-2.5-pro',
  api_key_override text,
  max_history_messages integer DEFAULT 20,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE mentor_config ENABLE ROW LEVEL SECURITY;
INSERT INTO mentor_config (id) VALUES (1) ON CONFLICT DO NOTHING;
CREATE POLICY "config_select" ON mentor_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "config_update" ON mentor_config FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Add file_type to mentor_knowledge for MD-first priority
ALTER TABLE mentor_knowledge ADD COLUMN IF NOT EXISTS file_type text DEFAULT 'md';
ALTER TABLE mentor_knowledge ADD COLUMN IF NOT EXISTS source_filename text;
