/*
  # Fix carousel_images RLS policies

  ## Problem
  The existing INSERT / UPDATE / DELETE policies use `USING (true)` / `WITH CHECK (true)`,
  which allows any authenticated user to mutate carousel images — effectively bypassing RLS.

  ## Fix
  Mirror the pattern used by the SEO dashboard: gate all writes on
  `(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'`.

  Only users whose Supabase Auth `app_metadata` has `role = "admin"` can insert,
  update, or delete rows. Anonymous and non-admin authenticated users get SELECT only.

  ## Storage
  Drop the duplicate / overly-broad SELECT policies on `storage.objects` for the
  `carousel-images` bucket. Public buckets serve objects by URL without needing a
  permissive SELECT policy — retaining one is sufficient; we replace both with a
  single scoped policy and remove the duplicate.

  ## Changes
  1. Drop all existing write policies on `carousel_images`
  2. Re-create INSERT / UPDATE / DELETE gated on `app_metadata.role = 'admin'`
  3. Drop duplicate storage SELECT policy, keep exactly one
*/

-- ── carousel_images: drop old unrestricted write policies ────────────────────

DROP POLICY IF EXISTS "Authenticated can insert carousel images"  ON public.carousel_images;
DROP POLICY IF EXISTS "Authenticated can update carousel images"  ON public.carousel_images;
DROP POLICY IF EXISTS "Authenticated can delete carousel images"  ON public.carousel_images;
DROP POLICY IF EXISTS "Authenticated insert carousel images"      ON public.carousel_images;
DROP POLICY IF EXISTS "Authenticated update carousel images"      ON public.carousel_images;
DROP POLICY IF EXISTS "Authenticated delete carousel images"      ON public.carousel_images;

-- ── carousel_images: re-create admin-only write policies ────────────────────

CREATE POLICY "Admin can insert carousel images"
  ON public.carousel_images FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin can update carousel images"
  ON public.carousel_images FOR UPDATE
  TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin can delete carousel images"
  ON public.carousel_images FOR DELETE
  TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── storage.objects: remove duplicate SELECT policies ────────────────────────

DROP POLICY IF EXISTS "Public can read carousel image objects"  ON storage.objects;
DROP POLICY IF EXISTS "Public read carousel image objects"      ON storage.objects;

-- Re-create a single, clearly-named SELECT policy.
-- Note: public buckets serve files by URL without needing this policy, but
-- we keep it so the Supabase client can resolve public URLs cleanly.
CREATE POLICY "Anyone can read carousel image objects"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'carousel-images');

-- ── storage.objects: restrict write policies to admin role ───────────────────

DROP POLICY IF EXISTS "Authenticated upload carousel image objects"  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update carousel image objects"  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete carousel image objects"  ON storage.objects;

CREATE POLICY "Admin can upload carousel image objects"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'carousel-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin can update carousel image objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'carousel-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin can delete carousel image objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'carousel-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
