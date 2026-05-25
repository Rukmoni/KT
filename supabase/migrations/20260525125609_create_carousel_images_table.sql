/*
  # Create carousel_images table and storage bucket

  1. New Tables
    - `carousel_images`
      - `id` (uuid, primary key)
      - `slide_id` (int, unique) — maps to ServicesCarousel slide IDs (1..n)
      - `image_url` (text) — public URL of the uploaded image in Supabase Storage
      - `updated_at` (timestamptz)

  2. Storage
    - Creates `carousel-images` bucket (public) for image uploads

  3. Security
    - RLS enabled on `carousel_images`
    - Authenticated users can SELECT all rows (admin UI reads them)
    - Authenticated users can INSERT/UPDATE/DELETE (admin only use-case; no public writes)
    - Anonymous (public) users can SELECT so the public carousel can read image URLs
*/

CREATE TABLE IF NOT EXISTS carousel_images (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_id   integer UNIQUE NOT NULL,
  image_url  text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE carousel_images ENABLE ROW LEVEL SECURITY;

-- Public can read (carousel on the website needs it without auth)
CREATE POLICY "Public can read carousel images"
  ON carousel_images FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated can insert carousel images"
  ON carousel_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated can update carousel images"
  ON carousel_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated can delete carousel images"
  ON carousel_images FOR DELETE
  TO authenticated
  USING (true);

-- Storage bucket for carousel images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('carousel-images', 'carousel-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of storage objects
CREATE POLICY "Public can read carousel image objects"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'carousel-images');

-- Allow authenticated to upload
CREATE POLICY "Authenticated can upload carousel images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'carousel-images');

-- Allow authenticated to update
CREATE POLICY "Authenticated can update carousel image objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'carousel-images');

-- Allow authenticated to delete
CREATE POLICY "Authenticated can delete carousel image objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'carousel-images');
