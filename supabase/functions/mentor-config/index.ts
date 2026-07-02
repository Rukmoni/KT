import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("mentor_config")
        .select("model_primary, model_lite, model_pro, api_key_override, max_history_messages")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;
      return new Response(JSON.stringify(data ?? {}), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const updates = await req.json();

      // Whitelist updatable fields
      const allowed = ["model_primary", "model_lite", "model_pro", "api_key_override", "max_history_messages"];
      const safe: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
          safe[key] = updates[key];
        }
      }

      const { error } = await supabase
        .from("mentor_config")
        .update(safe)
        .eq("id", 1);

      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
