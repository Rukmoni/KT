
-- Remove anon UPDATE/DELETE on conversations — writes go through service_role edge function only
DROP POLICY IF EXISTS "conv_update" ON mentor_conversations;
DROP POLICY IF EXISTS "conv_delete" ON mentor_conversations;

-- Remove anon DELETE on messages — only service_role (via CASCADE or edge function) may delete
DROP POLICY IF EXISTS "msg_delete" ON mentor_messages;

-- Confirm msg_insert still has the proper non-trivial EXISTS guard (re-apply to be explicit)
DROP POLICY IF EXISTS "msg_insert" ON mentor_messages;
CREATE POLICY "msg_insert" ON mentor_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    conversation_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM mentor_conversations c
      WHERE c.id = mentor_messages.conversation_id
        AND c.session_token IS NOT NULL
        AND length(trim(c.session_token)) > 5
    )
  );
