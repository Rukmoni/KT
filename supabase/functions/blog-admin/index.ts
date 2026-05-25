import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const url    = new URL(req.url);
    const action = url.searchParams.get('action'); // create | update | delete
    const body   = await req.json();

    if (action === 'create') {
      const { id: _id, created_at: _ca, updated_at: _ua, ...fields } = body;
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({ ...fields, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return json({ ok: true, post: data }, corsHeaders);
    }

    if (action === 'update') {
      const { id, created_at: _ca, ...fields } = body;
      if (!id) throw new Error('id required for update');
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return json({ ok: true, post: data }, corsHeaders);
    }

    if (action === 'delete') {
      const { id } = body;
      if (!id) throw new Error('id required for delete');
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      return json({ ok: true }, corsHeaders);
    }

    return json({ error: 'Unknown action' }, corsHeaders, 400);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, corsHeaders, 500);
  }
});

function json(data: unknown, headers: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
