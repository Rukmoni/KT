/*
  # Fix blog-media storage SELECT policy

  Replaces the broad "Public read blog-media" policy that allows listing all
  objects with a more restrictive policy that only permits reading individual
  objects by name (direct URL access), preventing bucket enumeration.
*/

DROP POLICY IF EXISTS "Public read blog-media" ON storage.objects;

CREATE POLICY "Public read blog-media objects"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'blog-media'
    AND name IS NOT NULL
  );
