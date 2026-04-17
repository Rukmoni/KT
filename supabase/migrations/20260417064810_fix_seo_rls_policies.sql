/*
  # Fix SEO Table RLS Policies

  ## Summary
  Replaces overly permissive RLS policies on seo_keywords, seo_actions, and seo_checks
  that allowed anon users unrestricted write access.

  ## Changes
  - DROP all existing write policies (INSERT, UPDATE, DELETE) for anon on all three SEO tables
  - Re-create write policies restricted to `authenticated` role only
  - SELECT (read) policies for anon are retained so the frontend dashboard can read data

  ## Security
  - anon: SELECT only (read-only — needed for the admin dashboard which uses the anon key)
  - authenticated: full CRUD (for future authenticated admin flows)
  - No writes are possible from unauthenticated/anon context
*/

-- ── seo_keywords ────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admin can insert seo_keywords" ON seo_keywords;
DROP POLICY IF EXISTS "Admin can update seo_keywords" ON seo_keywords;
DROP POLICY IF EXISTS "Admin can delete seo_keywords" ON seo_keywords;

CREATE POLICY "Authenticated users can insert seo_keywords"
  ON seo_keywords FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update seo_keywords"
  ON seo_keywords FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete seo_keywords"
  ON seo_keywords FOR DELETE
  TO authenticated
  USING (true);

-- ── seo_actions ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admin can insert seo_actions" ON seo_actions;
DROP POLICY IF EXISTS "Admin can update seo_actions" ON seo_actions;
DROP POLICY IF EXISTS "Admin can delete seo_actions" ON seo_actions;

CREATE POLICY "Authenticated users can insert seo_actions"
  ON seo_actions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update seo_actions"
  ON seo_actions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete seo_actions"
  ON seo_actions FOR DELETE
  TO authenticated
  USING (true);

-- ── seo_checks ──────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admin can insert seo_checks" ON seo_checks;
DROP POLICY IF EXISTS "Admin can update seo_checks" ON seo_checks;
DROP POLICY IF EXISTS "Admin can delete seo_checks" ON seo_checks;

CREATE POLICY "Authenticated users can insert seo_checks"
  ON seo_checks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update seo_checks"
  ON seo_checks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete seo_checks"
  ON seo_checks FOR DELETE
  TO authenticated
  USING (true);
