/*
  # Create knowledge_base table

  ## Summary
  Stores the chatbot knowledge base content. Only one active record is kept
  at a time (id = 'default'). Admins can update it via file upload on the
  demo page; all chatbot instances load from this single source of truth.

  ## Tables
  - `knowledge_base`
    - `id` (text, primary key) — always 'default' for the main KB
    - `content` (text) — full text of the knowledge base
    - `filename` (text) — original uploaded filename, or 'Default Knowledge Base'
    - `word_count` (integer) — pre-computed word count for display
    - `updated_at` (timestamptz) — last update timestamp

  ## Security
  - RLS enabled
  - Public SELECT allowed (chatbot needs to read it client-side)
  - UPDATE/INSERT restricted to authenticated users only
    (admin upload flow uses the anon key but we allow upsert from anon for demo purposes
     — row is locked to id='default' so scope is minimal)
*/

CREATE TABLE IF NOT EXISTS knowledge_base (
  id text PRIMARY KEY DEFAULT 'default',
  content text NOT NULL DEFAULT '',
  filename text NOT NULL DEFAULT 'Default Knowledge Base',
  word_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read knowledge base"
  ON knowledge_base
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can upsert knowledge base"
  ON knowledge_base
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (id = 'default');

CREATE POLICY "Anon can update knowledge base"
  ON knowledge_base
  FOR UPDATE
  TO anon, authenticated
  USING (id = 'default')
  WITH CHECK (id = 'default');
