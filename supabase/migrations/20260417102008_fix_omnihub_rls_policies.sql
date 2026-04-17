/*
  # Fix OmniHub RLS Policies — Remove Always-True INSERT/UPDATE checks

  ## Problem
  Several omni_* tables have INSERT and UPDATE policies that use `WITH CHECK (true)` or
  `USING (true)`, which effectively bypass row-level security for authenticated users.

  ## Changes

  ### Modified Tables
  - `omni_conversations` — adds `created_by uuid` column; restricts INSERT/UPDATE to row owner
  - `omni_messages` — restricts INSERT to messages whose conversation is owned by the inserter
  - `omni_integrations` — adds `created_by uuid` column; restricts INSERT/UPDATE to row owner
  - `omni_ai_sources` — adds `created_by uuid` column; restricts INSERT/UPDATE to row owner
  - `omni_activity_logs` — adds `created_by uuid` column; restricts INSERT to the inserting user

  ### Security Changes
  - All previous always-true INSERT/UPDATE policies are dropped
  - New policies check `auth.uid()` against `created_by` for ownership
  - Seed rows (which have no owner) are updated to NULL created_by — these remain readable
    but cannot be mutated by regular users (admin-only via service role)

  ## Notes
  - SELECT policies remain permissive (all authenticated users can read all omni rows)
    because this is a shared internal vendor portal
  - The `created_by` column is nullable to remain compatible with existing seed data
*/

-- ─── omni_conversations ───────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'omni_conversations' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE omni_conversations ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated users can insert omni_conversations" ON omni_conversations;
DROP POLICY IF EXISTS "Authenticated users can update omni_conversations" ON omni_conversations;

CREATE POLICY "Users can insert own omni_conversations"
  ON omni_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own omni_conversations"
  ON omni_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- ─── omni_messages ────────────────────────────────────────────────────────────
-- messages don't need an owner column — restrict by conversation ownership

DROP POLICY IF EXISTS "Authenticated users can insert omni_messages" ON omni_messages;

CREATE POLICY "Users can insert messages in own conversations"
  ON omni_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM omni_conversations
      WHERE omni_conversations.id = omni_messages.conversation_id
        AND omni_conversations.created_by = auth.uid()
    )
  );

-- ─── omni_integrations ────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'omni_integrations' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE omni_integrations ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated users can insert omni_integrations" ON omni_integrations;
DROP POLICY IF EXISTS "Authenticated users can update omni_integrations" ON omni_integrations;

CREATE POLICY "Users can insert own omni_integrations"
  ON omni_integrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own omni_integrations"
  ON omni_integrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- ─── omni_ai_sources ──────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'omni_ai_sources' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE omni_ai_sources ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated users can insert omni_ai_sources" ON omni_ai_sources;
DROP POLICY IF EXISTS "Authenticated users can update omni_ai_sources" ON omni_ai_sources;

CREATE POLICY "Users can insert own omni_ai_sources"
  ON omni_ai_sources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own omni_ai_sources"
  ON omni_ai_sources FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- ─── omni_activity_logs ───────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'omni_activity_logs' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE omni_activity_logs ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated users can insert omni_activity_logs" ON omni_activity_logs;

CREATE POLICY "Users can insert own omni_activity_logs"
  ON omni_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);
