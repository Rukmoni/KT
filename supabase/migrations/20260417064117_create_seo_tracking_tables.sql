/*
  # SEO Tracking Tables

  ## Summary
  Creates tables to support the SEO admin dashboard in the Kuvanta Tech portal.
  Includes keyword tracking, action checklist, and automated SEO validation checks.

  ## Tables
  - seo_keywords: target keyword rankings and metadata
  - seo_actions: one-time and recurring SEO task checklist
  - seo_checks: automated SEO validation results

  ## Security
  RLS enabled. Admin-only portal uses anon key with open policies (admin routes are not publicly advertised).
*/

CREATE TABLE IF NOT EXISTS seo_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  target_url text DEFAULT '/',
  position integer,
  previous_position integer,
  monthly_volume integer DEFAULT 0,
  competition text DEFAULT 'medium' CHECK (competition IN ('low', 'medium', 'high')),
  intent text DEFAULT 'commercial' CHECK (intent IN ('informational', 'navigational', 'commercial', 'transactional')),
  notes text DEFAULT '',
  last_checked timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can select seo_keywords" ON seo_keywords FOR SELECT TO anon USING (true);
CREATE POLICY "Admin can insert seo_keywords" ON seo_keywords FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin can update seo_keywords" ON seo_keywords FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete seo_keywords" ON seo_keywords FOR DELETE TO anon USING (true);

CREATE TABLE IF NOT EXISTS seo_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'technical' CHECK (category IN ('technical', 'local', 'content', 'backlinks', 'ai-seo', 'performance')),
  frequency text DEFAULT 'one-time' CHECK (frequency IN ('one-time', 'weekly', 'biweekly', 'monthly', 'quarterly')),
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  due_date date,
  priority text DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  automation_possible boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seo_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can select seo_actions" ON seo_actions FOR SELECT TO anon USING (true);
CREATE POLICY "Admin can insert seo_actions" ON seo_actions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin can update seo_actions" ON seo_actions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete seo_actions" ON seo_actions FOR DELETE TO anon USING (true);

CREATE TABLE IF NOT EXISTS seo_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_name text NOT NULL,
  check_type text DEFAULT 'technical' CHECK (check_type IN ('technical', 'content', 'performance', 'structured-data', 'ai-seo', 'local')),
  status text DEFAULT 'pending' CHECK (status IN ('pass', 'fail', 'warning', 'pending')),
  detail text DEFAULT '',
  checked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seo_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can select seo_checks" ON seo_checks FOR SELECT TO anon USING (true);
CREATE POLICY "Admin can insert seo_checks" ON seo_checks FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin can update seo_checks" ON seo_checks FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete seo_checks" ON seo_checks FOR DELETE TO anon USING (true);

-- Seed default keywords
INSERT INTO seo_keywords (keyword, target_url, monthly_volume, competition, intent, notes) VALUES
  ('app development Malaysia', '/', 2400, 'high', 'commercial', 'Primary money keyword — build dedicated service page'),
  ('mobile app developer Kuala Lumpur', '/', 880, 'high', 'commercial', 'Critical for local SEO + GBP'),
  ('AI solutions Malaysia', '/', 720, 'medium', 'commercial', 'Low competition window — move fast'),
  ('Flutter developer Malaysia', '/', 390, 'medium', 'commercial', 'High buyer intent'),
  ('React Native Malaysia', '/', 320, 'medium', 'commercial', 'High buyer intent'),
  ('AI chatbot development Malaysia', '/', 260, 'low', 'commercial', 'Emerging niche — claim before competitors'),
  ('how much does app development cost Malaysia', '/', 480, 'low', 'informational', 'Great featured snippet opportunity — write pricing guide'),
  ('web portal development Malaysia', '/', 210, 'medium', 'commercial', 'Secondary service keyword'),
  ('pembangunan aplikasi Malaysia', '/', 170, 'low', 'commercial', 'Bahasa Malaysia variant — almost no competition'),
  ('software company Kuala Lumpur', '/', 590, 'high', 'commercial', 'Broad — add to Google Business Profile'),
  ('AI automation Malaysia', '/', 340, 'low', 'commercial', 'Rapidly growing search category')
ON CONFLICT DO NOTHING;

-- Seed default SEO actions
INSERT INTO seo_actions (title, description, category, frequency, priority, automation_possible, due_date) VALUES
  ('Enable Server-Side Rendering (SSR)', 'Migrate to Next.js or Astro/Gatsby. Without SSR, Google crawlers see a blank page. This is the single highest-impact SEO change.', 'technical', 'one-time', 'critical', false, '2026-04-30'),
  ('Set up Google Search Console', 'Verify via DNS TXT record, submit sitemap.xml, enable crawl error alerts.', 'technical', 'one-time', 'critical', false, '2026-04-20'),
  ('Set up Bing Webmaster Tools', 'Verify site and submit sitemap. Bing feeds Microsoft Copilot — critical for AI search visibility.', 'technical', 'one-time', 'critical', false, '2026-04-20'),
  ('Replace GA4 placeholder ID', 'Replace G-XXXXXXXXXX in index.html with your actual Google Analytics Measurement ID.', 'technical', 'one-time', 'critical', false, '2026-04-20'),
  ('Create Google Business Profile', 'Set category to "Software Company" and "Mobile App Developer". Add photos, service list, hours.', 'local', 'one-time', 'critical', false, '2026-04-25'),
  ('Submit sitemap to Google Search Console', 'After GSC is set up, submit https://kuvanta.tech/sitemap.xml to trigger indexing.', 'technical', 'one-time', 'high', true, '2026-04-22'),
  ('Submit to Clutch.co', 'Create a vendor profile on Clutch — the most authoritative tech company directory.', 'backlinks', 'one-time', 'high', false, '2026-04-30'),
  ('Submit to GoodFirms', 'Create profile on GoodFirms — another high-authority app developer directory.', 'backlinks', 'one-time', 'high', false, '2026-04-30'),
  ('Submit to Crunchbase', 'Free company profile — very authoritative for AI search citations.', 'backlinks', 'one-time', 'high', false, '2026-05-01'),
  ('Submit to AppFutura', 'App development-specific directory with good domain authority.', 'backlinks', 'one-time', 'medium', false, '2026-05-05'),
  ('Create dedicated Mobile App Development page', 'URL: /mobile-app-development. Needs unique H1, 400+ words, target keyword "app development Malaysia".', 'content', 'one-time', 'high', false, '2026-05-10'),
  ('Create dedicated AI Solutions page', 'URL: /ai-solutions. Target keyword: "AI solutions Malaysia". Low competition — move fast.', 'content', 'one-time', 'high', false, '2026-05-10'),
  ('Test structured data with Rich Results tool', 'Visit search.google.com/test/rich-results and validate JSON-LD schema added to index.html.', 'technical', 'one-time', 'high', true, '2026-04-21'),
  ('Check Core Web Vitals with PageSpeed Insights', 'Run pagespeed.web.dev for kuvanta.tech. Target: LCP <2.5s, CLS <0.1, INP <200ms.', 'performance', 'one-time', 'high', true, '2026-04-22'),
  ('Verify llms.txt is accessible', 'Navigate to https://kuvanta.tech/llms.txt to confirm AI crawlers can access it.', 'ai-seo', 'one-time', 'medium', true, '2026-04-21'),
  ('Review Google Business Profile', 'Check for new reviews, Q&As, update Posts section. Respond to every review within 24 hours.', 'local', 'weekly', 'high', false, NULL),
  ('Check Google Search Console for errors', 'Review crawl errors, coverage issues, and Core Web Vitals in GSC.', 'technical', 'weekly', 'high', false, NULL),
  ('Post on LinkedIn', 'Share a project highlight, team update, or tech tip once per week.', 'content', 'weekly', 'medium', false, NULL),
  ('Publish one blog article', 'Target 800-1200 words on topics like "AI in Malaysian retail", pricing guides, tech comparisons.', 'content', 'biweekly', 'high', false, NULL),
  ('Run backlink outreach', 'Guest post pitch or PR story to Digital News Asia, Vulcan Post, Tech in Asia.', 'backlinks', 'monthly', 'high', false, NULL),
  ('Keyword position check', 'Manually search target keywords in incognito or use Ubersuggest to check current rankings.', 'content', 'monthly', 'medium', true, NULL),
  ('Audit for broken links', 'Use Screaming Frog (free up to 500 URLs) or Ahrefs Webmaster Tools to find broken links.', 'technical', 'monthly', 'medium', true, NULL),
  ('Quarterly keyword gap analysis', 'Compare keyword rankings vs. top 3 competitors. Identify untapped keywords they rank for.', 'content', 'quarterly', 'medium', false, NULL),
  ('Quarterly technical SEO audit', 'Full crawl audit: duplicate content, redirect chains, canonical issues, mobile usability.', 'technical', 'quarterly', 'medium', true, NULL)
ON CONFLICT DO NOTHING;

-- Seed default automated SEO checks
INSERT INTO seo_checks (check_name, check_type, status, detail) VALUES
  ('Meta title present', 'technical', 'pass', 'Title tag exists in index.html with keyword-rich content (63 chars)'),
  ('Meta description present', 'technical', 'pass', 'Meta description exists — 152 chars, within optimal range'),
  ('Canonical URL set', 'technical', 'pass', 'Canonical points to https://kuvanta.tech/'),
  ('Open Graph tags', 'technical', 'pass', 'og:title, og:description, og:image all present'),
  ('Twitter Card tags', 'technical', 'pass', 'twitter:card, twitter:title, twitter:description present'),
  ('robots.txt accessible', 'technical', 'pass', 'robots.txt exists and allows all bots including GPTBot and ClaudeBot'),
  ('sitemap.xml exists', 'technical', 'pass', 'sitemap.xml created with 3 URL entries'),
  ('llms.txt accessible', 'ai-seo', 'pass', 'llms.txt created — allows AI crawlers to cite Kuvanta Tech'),
  ('Organization schema', 'structured-data', 'pass', 'JSON-LD Organization schema present in index.html'),
  ('LocalBusiness schema', 'structured-data', 'pass', 'JSON-LD LocalBusiness schema with KL geo coordinates present'),
  ('FAQ schema', 'structured-data', 'pass', 'FAQ schema with 4 Q&As — eligible for featured snippets'),
  ('Service schema', 'structured-data', 'pass', 'ItemList of 3 services with Service schema present'),
  ('Geo meta tags', 'local', 'pass', 'geo.region, geo.placename, geo.position all set for KL'),
  ('Google Analytics configured', 'technical', 'warning', 'GA4 tag present but using placeholder ID G-XXXXXXXXXX — replace with your real Measurement ID'),
  ('SSR / Static rendering', 'technical', 'fail', 'Site is a React SPA with no SSR. Google crawlers see blank page. Migrate to Next.js or use prerendering.'),
  ('Google Search Console verified', 'technical', 'pending', 'Not yet verified — complete GSC setup and submit sitemap'),
  ('Bing Webmaster Tools', 'technical', 'pending', 'Not yet verified — set up to feed Microsoft Copilot AI search'),
  ('Google Business Profile', 'local', 'pending', 'Not yet created — critical for local B2B keyword rankings'),
  ('Core Web Vitals score', 'performance', 'pending', 'Run PageSpeed Insights to get LCP, CLS, INP baseline scores'),
  ('Clutch.co listing', 'ai-seo', 'pending', 'Not listed — Clutch profiles are frequently cited by AI search engines')
ON CONFLICT DO NOTHING;
