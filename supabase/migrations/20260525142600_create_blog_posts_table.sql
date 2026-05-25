/*
  # Create blog_posts table

  Stores blog posts with full content, replacing the static posts.json file.

  ## New Table: blog_posts
  - id: auto-increment integer (matches existing post IDs)
  - slug: unique URL identifier
  - title: post title
  - category: category key (e.g. 'ai-strategy')
  - category_label: human-readable label
  - excerpt: short summary
  - body: full post content (plain text with markdown-lite formatting)
  - linkedin_url: link to original LinkedIn post
  - author: author name
  - author_title: author professional title
  - tags: array of tag strings
  - image: optional image URL
  - video: optional YouTube URL
  - published: whether the post is live
  - draft: whether it is a draft
  - created_at / updated_at: timestamps

  ## Security
  - RLS enabled
  - Public SELECT for published, non-draft posts
  - Admin-only INSERT / UPDATE / DELETE (app_metadata.role = 'admin')
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id            serial PRIMARY KEY,
  slug          text UNIQUE NOT NULL,
  title         text NOT NULL DEFAULT '',
  category      text NOT NULL DEFAULT 'ai-strategy',
  category_label text NOT NULL DEFAULT '',
  excerpt       text NOT NULL DEFAULT '',
  body          text NOT NULL DEFAULT '',
  linkedin_url  text NOT NULL DEFAULT '',
  author        text NOT NULL DEFAULT 'Nagarajan Maheswaran',
  author_title  text NOT NULL DEFAULT 'Senior Project & Programme Manager | PMP | PSM I | CSPO',
  tags          text[] NOT NULL DEFAULT '{}',
  image         text,
  video         text,
  published     boolean NOT NULL DEFAULT false,
  draft         boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true AND draft = false);

CREATE POLICY "Admin can read all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts (category);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts (published, draft);
