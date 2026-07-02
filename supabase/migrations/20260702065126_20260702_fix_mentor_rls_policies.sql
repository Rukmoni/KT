
-- mentor_config: remove anon UPDATE (writes go through service_role edge function only)
DROP POLICY IF EXISTS "config_update" ON mentor_config;

-- mentor_conversations UPDATE: require non-empty session_token
DROP POLICY IF EXISTS "conv_update" ON mentor_conversations;
CREATE POLICY "conv_update" ON mentor_conversations FOR UPDATE
  TO anon, authenticated
  USING (session_token IS NOT NULL AND length(trim(session_token)) > 5)
  WITH CHECK (session_token IS NOT NULL AND length(trim(session_token)) > 5);

-- mentor_conversations DELETE: same session_token guard
DROP POLICY IF EXISTS "conv_delete" ON mentor_conversations;
CREATE POLICY "conv_delete" ON mentor_conversations FOR DELETE
  TO anon, authenticated
  USING (session_token IS NOT NULL AND length(trim(session_token)) > 5);

-- mentor_messages INSERT: only if conversation_id references a row with a real session_token
DROP POLICY IF EXISTS "msg_insert" ON mentor_messages;
CREATE POLICY "msg_insert" ON mentor_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    conversation_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM mentor_conversations
      WHERE id = conversation_id
        AND session_token IS NOT NULL
        AND length(trim(session_token)) > 5
    )
  );

-- mentor_messages DELETE: drop anon (CASCADE from conversation delete handles cleanup)
DROP POLICY IF EXISTS "msg_delete" ON mentor_messages;
