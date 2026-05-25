/*
  # Carousel Images

  1. New Tables
    - `carousel_images`
      - `id` (uuid, primary key)
      - `slide_id` (integer, unique) — maps 1-to-1 with ServicesCarousel slide IDs
      - `image_url` (text) — public Supabase Storage URL
      - `updated_at` (timestamptz)

  2. Storage
    - Creates `carousel-images` public bucket

  3. Security
    - RLS enabled; public anonymous SELECT so the live carousel can read without auth
    - Authenticated users can INSERT / UPDATE / DELETE (admin use only)
*/

CREATE TABLE IF NOT EXISTS carousel_images (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_id   integer     UNIQUE NOT NULL,
  image_url  text        NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE carousel_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read carousel images"
  ON carousel_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated insert carousel images"
  ON carousel_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update carousel images"
  ON carousel_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete carousel images"
  ON carousel_images FOR DELETE
  TO authenticated
  USING (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('carousel-images', 'carousel-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read carousel image objects"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'carousel-images');

CREATE POLICY "Authenticated upload carousel image objects"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'carousel-images');

CREATE POLICY "Authenticated update carousel image objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'carousel-images');

CREATE POLICY "Authenticated delete carousel image objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'carousel-images');
