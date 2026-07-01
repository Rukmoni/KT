-- Add cost estimate column to token usage
ALTER TABLE mentor_token_usage ADD COLUMN IF NOT EXISTS cost_usd_estimate numeric(10,6) DEFAULT 0;

-- Add file_key to mentor_knowledge for whole-file retrieval
ALTER TABLE mentor_knowledge ADD COLUMN IF NOT EXISTS file_key text;
CREATE INDEX IF NOT EXISTS mentor_knowledge_file_key_idx ON mentor_knowledge(file_key);

-- Full-text search index if not already present
CREATE INDEX IF NOT EXISTS mentor_knowledge_fts_idx ON mentor_knowledge USING gin(fts);
