import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
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
    const url = new URL(req.url);
    // Expected paths: /mentor-conversations  or  /mentor-conversations/{id}
    const parts = url.pathname.replace(/^\/mentor-conversations\/?/, "").split("/").filter(Boolean);
    const convId = parts[0] ?? null;

    // PATCH /mentor-conversations/{id}  — update title, last_mode, message_count
    if (req.method === "PATCH" && convId) {
      const body = await req.json();
      const allowed = ["title", "last_mode", "message_count", "subject_code"];
      const safe: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, key)) safe[key] = body[key];
      }

      // Require session_token in body to verify ownership (best-effort without auth)
      const sessionToken: string | undefined = body.session_token;
      if (!sessionToken || sessionToken.trim().length <= 5) {
        return new Response(JSON.stringify({ error: "session_token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabase
        .from("mentor_conversations")
        .update(safe)
        .eq("id", convId)
        .eq("session_token", sessionToken);

      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /mentor-conversations/{id}
    if (req.method === "DELETE" && convId) {
      const sessionToken = url.searchParams.get("session_token");
      if (!sessionToken || sessionToken.trim().length <= 5) {
        return new Response(JSON.stringify({ error: "session_token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabase
        .from("mentor_conversations")
        .delete()
        .eq("id", convId)
        .eq("session_token", sessionToken);

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
