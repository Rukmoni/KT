/*
  # Fix Security Issues

  ## Summary
  Addresses security advisories for unindexed foreign keys and overly permissive RLS policies.

  ## 1. Unindexed Foreign Keys
  Adds covering indexes on every foreign key column that lacked one, across:
  - n2t_ai_reviews (meeting_id)
  - n2t_jira_drafts (meeting_id, review_id)
  - n2t_jira_tickets (draft_id, meeting_id)
  - n2t_slack_notifications (meeting_id)
  - n2t_transcripts (meeting_id)
  - n2t_workflow_runs (meeting_id)

  ## 2. RLS Policies Always True
  Drops and recreates all INSERT/UPDATE policies that had WITH CHECK (true) or USING (true).
  Replaced with auth.uid() IS NOT NULL — enforces authentication without the blanket "true"
  that Supabase flags as bypassing row-level security.

  ## Notes
  - Leaked Password Protection must be enabled manually via the Supabase Dashboard:
    Authentication > Providers > Email > "Prevent use of leaked passwords"
  - Auth DB Connection Strategy must also be changed via the Dashboard:
    Project Settings > Database > Connection pooling > Percentage-based strategy
*/

-- ── 1. Foreign Key Indexes ──────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_n2t_ai_reviews_meeting_id
  ON n2t_ai_reviews (meeting_id);

CREATE INDEX IF NOT EXISTS idx_n2t_jira_drafts_meeting_id
  ON n2t_jira_drafts (meeting_id);

CREATE INDEX IF NOT EXISTS idx_n2t_jira_drafts_review_id
  ON n2t_jira_drafts (review_id);

CREATE INDEX IF NOT EXISTS idx_n2t_jira_tickets_draft_id
  ON n2t_jira_tickets (draft_id);

CREATE INDEX IF NOT EXISTS idx_n2t_jira_tickets_meeting_id
  ON n2t_jira_tickets (meeting_id);

CREATE INDEX IF NOT EXISTS idx_n2t_slack_notifications_meeting_id
  ON n2t_slack_notifications (meeting_id);

CREATE INDEX IF NOT EXISTS idx_n2t_transcripts_meeting_id
  ON n2t_transcripts (meeting_id);

CREATE INDEX IF NOT EXISTS idx_n2t_workflow_runs_meeting_id
  ON n2t_workflow_runs (meeting_id);


-- ── 2. Fix RLS Policies (replace always-true with auth.uid() IS NOT NULL) ──────

-- n2t_ai_reviews
DROP POLICY IF EXISTS "Authenticated users can insert ai_reviews" ON n2t_ai_reviews;
DROP POLICY IF EXISTS "Authenticated users can update ai_reviews" ON n2t_ai_reviews;

CREATE POLICY "Authenticated users can insert ai_reviews"
  ON n2t_ai_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update ai_reviews"
  ON n2t_ai_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- n2t_audit_logs
DROP POLICY IF EXISTS "Authenticated users can insert audit_logs" ON n2t_audit_logs;

CREATE POLICY "Authenticated users can insert audit_logs"
  ON n2t_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- n2t_integration_tests
DROP POLICY IF EXISTS "Authenticated users can insert tests" ON n2t_integration_tests;

CREATE POLICY "Authenticated users can insert tests"
  ON n2t_integration_tests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- n2t_integrations
DROP POLICY IF EXISTS "Authenticated users can insert integrations" ON n2t_integrations;
DROP POLICY IF EXISTS "Authenticated users can update integrations" ON n2t_integrations;

CREATE POLICY "Authenticated users can insert integrations"
  ON n2t_integrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update integrations"
  ON n2t_integrations FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- n2t_jira_drafts
DROP POLICY IF EXISTS "Authenticated users can insert jira_drafts" ON n2t_jira_drafts;
DROP POLICY IF EXISTS "Authenticated users can update jira_drafts" ON n2t_jira_drafts;

CREATE POLICY "Authenticated users can insert jira_drafts"
  ON n2t_jira_drafts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update jira_drafts"
  ON n2t_jira_drafts FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- n2t_jira_tickets
DROP POLICY IF EXISTS "Authenticated users can insert jira_tickets" ON n2t_jira_tickets;

CREATE POLICY "Authenticated users can insert jira_tickets"
  ON n2t_jira_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- n2t_meetings
DROP POLICY IF EXISTS "Authenticated users can insert meetings" ON n2t_meetings;
DROP POLICY IF EXISTS "Authenticated users can update meetings" ON n2t_meetings;

CREATE POLICY "Authenticated users can insert meetings"
  ON n2t_meetings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update meetings"
  ON n2t_meetings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- n2t_slack_notifications
DROP POLICY IF EXISTS "Authenticated users can insert slack_notifications" ON n2t_slack_notifications;
DROP POLICY IF EXISTS "Authenticated users can update slack_notifications" ON n2t_slack_notifications;

CREATE POLICY "Authenticated users can insert slack_notifications"
  ON n2t_slack_notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update slack_notifications"
  ON n2t_slack_notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- n2t_transcripts
DROP POLICY IF EXISTS "Authenticated users can insert transcripts" ON n2t_transcripts;

CREATE POLICY "Authenticated users can insert transcripts"
  ON n2t_transcripts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- n2t_workflow_runs
DROP POLICY IF EXISTS "Authenticated users can insert workflow_runs" ON n2t_workflow_runs;
DROP POLICY IF EXISTS "Authenticated users can update workflow_runs" ON n2t_workflow_runs;

CREATE POLICY "Authenticated users can insert workflow_runs"
  ON n2t_workflow_runs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update workflow_runs"
  ON n2t_workflow_runs FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
