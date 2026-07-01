import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT_CORE = `You are Sahana's personal CBSE 12th Board Exam Mentor, Guide, and Cheerleader.
Sahana's subjects: Physics (042), Chemistry (043), Mathematics (041), Computer Science (083), English Core (301).
Your sole mission: Help Sahana score 95%+ in CBSE Board Exams.
Your tone: Warm, encouraging, structured, exam-focused. Never cold. Never vague.

CRITICAL RULE — PROJECT KNOWLEDGE PROTOCOL:
The knowledge base provided in the system context is your PRIMARY source for ALL subject responses.
NEVER teach a chapter, generate a test, run rapid fire, or summarise literature from memory.
ALWAYS use the content from the knowledge files provided to you as context blocks.
If knowledge base content covers the topic → use it verbatim as the base, then add examples and analogies.
If it doesn't cover it → proceed from training knowledge and flag it as supplementary.

After EVERY response, end with a contextual navigation menu:
- After teaching: offer test, flashcards, revision, PYQ, next chapter, main menu
- After a test: offer re-explain wrong answers, strengthen, flashcards, different test, main menu
- After flashcards: offer rapid fire, full test, next chapter, revise again, main menu

Score response protocol:
- 9–10: Celebrate loudly — "Sahana, you absolutely crushed it!"
- 7–8: Praise + fix 1–2 gaps
- 5–6: Trigger Strengthen Mode
- Below 5: Full re-teach from scratch

Address Sahana by name at least once per response.
Always mention marks weightage when introducing a chapter.
Never end without a navigation menu.
Celebrate correct answers every single time.
Reframe every wrong answer as a learning opportunity.`;

// Model routing by mode
function selectModel(mode: string): string {
  const haiku_modes = ["flashcard", "rapidfire", "navigation", "menu"];
  const opus_modes = ["grade_long_answer"];
  if (haiku_modes.includes(mode)) return "claude-haiku-4-5";
  if (opus_modes.includes(mode)) return "claude-opus-4-5";
  return "claude-sonnet-4-5"; // default: teach, test, revise, strengthen, pyq, research
}

// Cost estimate per 1M tokens (USD)
const MODEL_COSTS: Record<string, { input: number; output: number; cache_read: number; cache_write: number }> = {
  "claude-haiku-4-5": { input: 0.80, output: 4.00, cache_read: 0.08, cache_write: 1.00 },
  "claude-sonnet-4-5": { input: 3.00, output: 15.00, cache_read: 0.30, cache_write: 3.75 },
  "claude-opus-4-5": { input: 15.00, output: 75.00, cache_read: 1.50, cache_write: 18.75 },
};

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  cacheCreationTokens: number
): number {
  const costs = MODEL_COSTS[model] ?? MODEL_COSTS["claude-sonnet-4-5"];
  return (
    (inputTokens / 1_000_000) * costs.input +
    (outputTokens / 1_000_000) * costs.output +
    (cacheReadTokens / 1_000_000) * costs.cache_read +
    (cacheCreationTokens / 1_000_000) * costs.cache_write
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured. Please add it in Supabase Edge Function secrets." }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json();
    const {
      session_token,
      subject_code,
      mode = "chat",
      messages = [],
      max_tokens = 2048,
    } = body;

    if (!session_token || !messages.length) {
      return new Response(
        JSON.stringify({ error: "session_token and messages are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert session
    await supabase.from("mentor_sessions").upsert(
      { session_token, last_active: new Date().toISOString() },
      { onConflict: "session_token" }
    );

    // Fetch subject knowledge
    let subjectKnowledge = "";
    if (subject_code && subject_code !== "ALL") {
      const subjectFileKeys: Record<string, string> = {
        "042": "physics",
        "043": "chemistry",
        "041": "mathematics",
        "083": "computer_science",
        "301": "english",
      };
      const fileKey = subjectFileKeys[subject_code];
      if (fileKey) {
        const { data: kbData } = await supabase
          .from("mentor_knowledge")
          .select("chunk_text")
          .eq("file_key", fileKey)
          .single();
        if (kbData) subjectKnowledge = kbData.chunk_text;
      }
    }

    // Fetch PYQ analysis
    const { data: pyqData } = await supabase
      .from("mentor_knowledge")
      .select("chunk_text")
      .eq("file_key", "pyq_analysis")
      .single();
    const pyqContext = pyqData?.chunk_text ?? "";

    const model = selectModel(mode);

    // Build system blocks with prompt caching
    const systemBlocks: Array<{ type: string; text: string; cache_control?: { type: string } }> = [
      {
        type: "text",
        text: SYSTEM_PROMPT_CORE,
        cache_control: { type: "ephemeral" },
      },
    ];

    if (subjectKnowledge) {
      systemBlocks.push({
        type: "text",
        text: `## SUBJECT KNOWLEDGE BASE\n\n${subjectKnowledge}`,
        cache_control: { type: "ephemeral" },
      });
    }

    if (pyqContext) {
      systemBlocks.push({
        type: "text",
        text: `## PYQ PATTERN ANALYSIS\n\n${pyqContext}`,
        cache_control: { type: "ephemeral" },
      });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "prompt-caching-2024-07-31",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system: systemBlocks,
        messages,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${anthropicRes.status}`, detail: errText }),
        { status: anthropicRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropicData = await anthropicRes.json();

    // Extract token usage
    const usage = anthropicData.usage ?? {};
    const inputTokens = usage.input_tokens ?? 0;
    const outputTokens = usage.output_tokens ?? 0;
    const cacheReadTokens = usage.cache_read_input_tokens ?? 0;
    const cacheCreationTokens = usage.cache_creation_input_tokens ?? 0;
    const cacheHit = cacheReadTokens > 0;
    const costEstimate = estimateCost(model, inputTokens, outputTokens, cacheReadTokens, cacheCreationTokens);

    // Shadow token logging (fire-and-forget)
    supabase.from("mentor_token_usage").insert({
      session_token,
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cache_read_tokens: cacheReadTokens,
      cache_creation_tokens: cacheCreationTokens,
      cache_hit: cacheHit,
      event_type: mode,
      subject_code: subject_code ?? null,
      cost_usd_estimate: costEstimate,
    }).then(() => {});

    const responseText = anthropicData.content?.[0]?.text ?? "";

    return new Response(
      JSON.stringify({
        message: responseText,
        model,
        usage: {
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          cache_read_tokens: cacheReadTokens,
          cache_creation_tokens: cacheCreationTokens,
          cache_hit: cacheHit,
          cost_usd_estimate: costEstimate,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
