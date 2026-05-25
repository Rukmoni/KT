/*
  # Remove carousel-images storage SELECT policy

  Public Supabase buckets serve individual objects by URL without any RLS policy.
  The SELECT policy on storage.objects only enables directory listing, which is
  not needed and exposes the full file listing to anyone.

  Dropping it means:
  - Public URLs continue to work (served by the CDN, not gated by RLS)
  - Clients can no longer list all files in the bucket
*/

DROP POLICY IF EXISTS "Anyone can read carousel image objects" ON storage.objects;
