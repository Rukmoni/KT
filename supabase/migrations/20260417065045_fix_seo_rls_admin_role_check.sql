/*
  # Fix SEO Table RLS Policies - Restrict Writes to Admin Role

  ## Summary
  Replaces permissive write policies (USING/WITH CHECK always true) on the three SEO
  tables with policies that verify the user has `role = 'admin'` set in their
  JWT app_metadata. This prevents any authenticated user from writing — only
  designated admins can mutate SEO data.

  ## Changes
  - DROP existing unrestricted authenticated write policies on seo_keywords, seo_actions, seo_checks
  - Re-create INSERT / UPDATE / DELETE policies gated on `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'`
  - SELECT policies are unchanged (anon read remains open for the dashboard)

  ## Security
  - anon: SELECT only
  - authenticated non-admin: SELECT only
  - authenticated admin (app_metadata.role = 'admin'): full CRUD
*/

-- ── seo_keywords ────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated users can insert seo_keywords" ON seo_keywords;
DROP POLICY IF EXISTS "Authenticated users can update seo_keywords" ON seo_keywords;
DROP POLICY IF EXISTS "Authenticated users can delete seo_keywords" ON seo_keywords;

CREATE POLICY "Admin role can insert seo_keywords"
  ON seo_keywords FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin role can update seo_keywords"
  ON seo_keywords FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin role can delete seo_keywords"
  ON seo_keywords FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── seo_actions ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated users can insert seo_actions" ON seo_actions;
DROP POLICY IF EXISTS "Authenticated users can update seo_actions" ON seo_actions;
DROP POLICY IF EXISTS "Authenticated users can delete seo_actions" ON seo_actions;

CREATE POLICY "Admin role can insert seo_actions"
  ON seo_actions FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin role can update seo_actions"
  ON seo_actions FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin role can delete seo_actions"
  ON seo_actions FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── seo_checks ──────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated users can insert seo_checks" ON seo_checks;
DROP POLICY IF EXISTS "Authenticated users can update seo_checks" ON seo_checks;
DROP POLICY IF EXISTS "Authenticated users can delete seo_checks" ON seo_checks;

CREATE POLICY "Admin role can insert seo_checks"
  ON seo_checks FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin role can update seo_checks"
  ON seo_checks FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin role can delete seo_checks"
  ON seo_checks FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
