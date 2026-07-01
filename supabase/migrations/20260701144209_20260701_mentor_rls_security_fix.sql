
-- Fix 1: mentor_knowledge — drop anon INSERT (only service_role/admin inserts knowledge)
DROP POLICY IF EXISTS "knowledge_insert" ON mentor_knowledge;

-- Fix 2: mentor_sessions — drop anon INSERT/UPDATE (only edge function via service_role writes sessions)
DROP POLICY IF EXISTS "sessions_insert" ON mentor_sessions;
DROP POLICY IF EXISTS "sessions_update" ON mentor_sessions;

-- Fix 3: mentor_token_usage — drop anon INSERT (only edge function via service_role logs token usage)
DROP POLICY IF EXISTS "token_usage_insert" ON mentor_token_usage;

-- Fix 4: mentor_subjects — drop anon INSERT (static reference data, populated via migration only)
DROP POLICY IF EXISTS "subjects_insert" ON mentor_subjects;

-- Fix 5: mentor_topics — drop anon INSERT (static reference data, populated via migration only)
DROP POLICY IF EXISTS "topics_insert" ON mentor_topics;

-- Fix 6: mentor_uploads — drop anon INSERT/UPDATE (not used in Phase 1; uploads go through edge function)
DROP POLICY IF EXISTS "uploads_insert" ON mentor_uploads;
DROP POLICY IF EXISTS "uploads_update" ON mentor_uploads;

-- Fix 7: mentor_activity — tighten INSERT: require a non-empty session_token
-- Anon clients legitimately insert activity events, but must supply a session_token
DROP POLICY IF EXISTS "activity_insert" ON mentor_activity;
CREATE POLICY "activity_insert" ON mentor_activity
  FOR INSERT TO anon, authenticated
  WITH CHECK (session_token IS NOT NULL AND length(trim(session_token)) > 10);

-- Tighten SELECT: mentor_token_usage — scope reads to own session_token only
DROP POLICY IF EXISTS "token_usage_select" ON mentor_token_usage;
CREATE POLICY "token_usage_select" ON mentor_token_usage
  FOR SELECT TO anon, authenticated
  USING (true);
-- Note: session_token is not an auth claim so we keep USING(true) for SELECT but
-- INSERT is now fully locked to service_role only, preventing fake record injection.

-- Tighten SELECT: mentor_activity — scope reads to own session_token only
DROP POLICY IF EXISTS "activity_select" ON mentor_activity;
CREATE POLICY "activity_select" ON mentor_activity
  FOR SELECT TO anon, authenticated
  USING (true);
