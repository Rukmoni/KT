/*
# Create demo_visits table for tracking demo page visits

1. New Tables
- `demo_visits`
  - `id` (uuid, primary key)
  - `demo_id` (text, not null) — identifier of the demo (e.g. 'gantt-studio')
  - `visited_at` (timestamptz, default now()) — when the visit occurred
  - `visitor_fingerprint` (text, nullable) — optional browser fingerprint to deduplicate visits

2. Security
- Enable RLS on `demo_visits`.
- Allow anon + authenticated to INSERT (anyone can record a visit) and SELECT (anyone can read counts).
- No UPDATE or DELETE needed — visits are append-only.

3. Notes
- This is a single-tenant, no-auth table. The demos page has no sign-in, so anon must be able to write and read.
- An index on `demo_id` is added for efficient count queries.
*/

CREATE TABLE IF NOT EXISTS demo_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_id text NOT NULL,
  visited_at timestamptz NOT NULL DEFAULT now(),
  visitor_fingerprint text
);

CREATE INDEX IF NOT EXISTS idx_demo_visits_demo_id ON demo_visits(demo_id);

ALTER TABLE demo_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_demo_visits" ON demo_visits;
CREATE POLICY "anon_select_demo_visits" ON demo_visits FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_demo_visits" ON demo_visits;
CREATE POLICY "anon_insert_demo_visits" ON demo_visits FOR INSERT
  TO anon, authenticated WITH CHECK (true);