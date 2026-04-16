/*
  # Note2Task Full Schema

  ## Summary
  Creates all tables required for the Meeting Transcript → Jira AI Workflow demo.

  ## Tables
  - `n2t_integrations` – Zoom/Jira/Slack connection configs (one row per type)
  - `n2t_integration_tests` – History of connection test attempts
  - `n2t_meetings` – Processed meeting records
  - `n2t_transcripts` – Raw transcript text per meeting
  - `n2t_ai_reviews` – Structured AI extraction results (JSON)
  - `n2t_jira_drafts` – Proposed Jira ticket drafts (editable before creation)
  - `n2t_jira_tickets` – Created Jira ticket records
  - `n2t_slack_notifications` – Slack message records
  - `n2t_workflow_runs` – End-to-end workflow execution log
  - `n2t_audit_logs` – Immutable audit trail for all major actions

  ## Security
  RLS enabled on all tables. All rows are accessible to authenticated users only.
*/

-- ── Integrations ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('zoom', 'jira', 'slack')),
  label text NOT NULL DEFAULT '',
  config jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'not_configured' CHECK (status IN ('not_configured','connected','test_passed','error')),
  last_tested_at timestamptz,
  last_test_result text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (type)
);

ALTER TABLE n2t_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read integrations"
  ON n2t_integrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert integrations"
  ON n2t_integrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update integrations"
  ON n2t_integrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Integration Tests ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_integration_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type text NOT NULL,
  test_type text NOT NULL,
  passed boolean NOT NULL DEFAULT false,
  message text,
  details jsonb,
  tested_at timestamptz DEFAULT now()
);

ALTER TABLE n2t_integration_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read tests"
  ON n2t_integration_tests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tests"
  ON n2t_integration_tests FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ── Meetings ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Untitled Meeting',
  host text,
  attendees text[],
  meeting_date timestamptz,
  duration_minutes integer DEFAULT 0,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('zoom_webhook','manual','sample')),
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','transcript_fetched','ai_analyzed','jira_created','slack_notified','failed')),
  external_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE n2t_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read meetings"
  ON n2t_meetings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert meetings"
  ON n2t_meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update meetings"
  ON n2t_meetings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Transcripts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES n2t_meetings(id),
  content text NOT NULL DEFAULT '',
  word_count integer DEFAULT 0,
  hash text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE n2t_transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read transcripts"
  ON n2t_transcripts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transcripts"
  ON n2t_transcripts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ── AI Reviews ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_ai_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES n2t_meetings(id),
  summary text,
  decisions jsonb DEFAULT '[]',
  risks jsonb DEFAULT '[]',
  blockers jsonb DEFAULT '[]',
  tasks jsonb DEFAULT '[]',
  overall_confidence numeric(4,2) DEFAULT 0,
  needs_review boolean DEFAULT false,
  raw_response jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE n2t_ai_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read ai_reviews"
  ON n2t_ai_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ai_reviews"
  ON n2t_ai_reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ai_reviews"
  ON n2t_ai_reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Jira Drafts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_jira_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES n2t_meetings(id),
  review_id uuid REFERENCES n2t_ai_reviews(id),
  summary text NOT NULL,
  description text,
  issue_type text DEFAULT 'Task',
  priority text DEFAULT 'Medium',
  assignee text,
  labels text[],
  due_date date,
  confidence numeric(4,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','rejected','created','needs_review')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE n2t_jira_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read jira_drafts"
  ON n2t_jira_drafts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert jira_drafts"
  ON n2t_jira_drafts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update jira_drafts"
  ON n2t_jira_drafts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Jira Tickets ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_jira_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id uuid REFERENCES n2t_jira_drafts(id),
  meeting_id uuid REFERENCES n2t_meetings(id),
  jira_key text,
  jira_url text,
  jira_status text DEFAULT 'To Do',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE n2t_jira_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read jira_tickets"
  ON n2t_jira_tickets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert jira_tickets"
  ON n2t_jira_tickets FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ── Slack Notifications ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_slack_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid REFERENCES n2t_meetings(id),
  channel text,
  template text DEFAULT 'success',
  payload jsonb,
  sent_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE n2t_slack_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read slack_notifications"
  ON n2t_slack_notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert slack_notifications"
  ON n2t_slack_notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update slack_notifications"
  ON n2t_slack_notifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Workflow Runs ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_workflow_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid REFERENCES n2t_meetings(id),
  run_type text DEFAULT 'auto' CHECK (run_type IN ('auto','sample_test','manual')),
  steps jsonb DEFAULT '[]',
  status text DEFAULT 'running' CHECK (status IN ('running','passed','failed','partial')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  error_message text
);

ALTER TABLE n2t_workflow_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read workflow_runs"
  ON n2t_workflow_runs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert workflow_runs"
  ON n2t_workflow_runs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update workflow_runs"
  ON n2t_workflow_runs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Audit Logs ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n2t_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text,
  entity_id text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE n2t_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read audit_logs"
  ON n2t_audit_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert audit_logs"
  ON n2t_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ── Seed sample meetings for demo ─────────────────────────────────────────────
INSERT INTO n2t_meetings (title, host, attendees, meeting_date, duration_minutes, source, status, metadata)
VALUES
  ('Q4 Sprint Architecture Review', 'Sarah Chen', ARRAY['Marcus Johnson','Priya Nair','Tom Walsh'], now() - interval '2 days', 45, 'zoom_webhook', 'slack_notified', '{"jira_tickets_created": 5}'),
  ('Internal Security Audit Sync', 'Alex Rivera', ARRAY['Dana Park','Chris Lee'], now() - interval '3 days', 72, 'zoom_webhook', 'ai_analyzed', '{}'),
  ('Design Feedback: Mobile UX', 'Priya Nair', ARRAY['Sarah Chen','Tom Walsh','Anika Rao'], now() - interval '3 days', 22, 'zoom_webhook', 'slack_notified', '{"jira_tickets_created": 3}'),
  ('Client Delivery Review — RetailEdge', 'Marcus Johnson', ARRAY['Sarah Chen','Client Team'], now() - interval '4 days', 58, 'zoom_webhook', 'slack_notified', '{"jira_tickets_created": 7}'),
  ('Sprint 4 Planning Session', 'Sarah Chen', ARRAY['Full Team'], now() - interval '5 days', 65, 'manual', 'slack_notified', '{"jira_tickets_created": 6}')
ON CONFLICT DO NOTHING;
