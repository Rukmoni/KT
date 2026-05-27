/*
  # Create blog-media storage bucket

  Creates a public Supabase Storage bucket for blog post images and videos.
  - Bucket: blog-media (public)
  - Admin INSERT policy: authenticated users (service role bypasses RLS)
  - Public SELECT policy: anyone can read uploaded media
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of all objects in blog-media
CREATE POLICY "Public read blog-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload blog-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-media');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated delete blog-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-media');
