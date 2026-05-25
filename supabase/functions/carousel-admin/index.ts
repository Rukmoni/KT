import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Use service role key to bypass RLS — this function acts as trusted admin
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action'); // 'upsert' | 'delete'

    if (req.method === 'DELETE' || action === 'delete') {
      const { slideId } = await req.json();
      if (!slideId) {
        return new Response(JSON.stringify({ error: 'slideId required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase
        .from('carousel_images')
        .delete()
        .eq('slide_id', slideId);

      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && action === 'upload') {
      // Receive multipart form: file + slideId
      const form = await req.formData();
      const slideId = Number(form.get('slideId'));
      const file = form.get('file') as File | null;

      if (!slideId || !file) {
        return new Response(JSON.stringify({ error: 'slideId and file required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const ext = file.name.split('.').pop() ?? 'png';
      const path = `slide-${slideId}.${ext}`;
      const bytes = await file.arrayBuffer();

      const { error: upErr } = await supabase.storage
        .from('carousel-images')
        .upload(path, bytes, { upsert: true, contentType: file.type });

      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage
        .from('carousel-images')
        .getPublicUrl(path);

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: dbErr } = await supabase
        .from('carousel_images')
        .upsert(
          { slide_id: slideId, image_url: publicUrl, updated_at: new Date().toISOString() },
          { onConflict: 'slide_id' },
        );

      if (dbErr) throw dbErr;

      return new Response(JSON.stringify({ ok: true, publicUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
