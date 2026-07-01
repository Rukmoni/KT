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
  const flash_lite_modes = ["flashcard", "rapidfire", "navigation", "menu"];
  const pro_modes = ["grade_long_answer"];
  if (flash_lite_modes.includes(mode)) return "gemini-2.0-flash";
  if (pro_modes.includes(mode)) return "gemini-2.5-pro";
  return "gemini-2.5-flash"; // default: teach, test, revise, strengthen, pyq, research
}

// Cost estimate per 1M tokens (USD)
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "gemini-2.0-flash":  { input: 0.10,  output: 0.40  },
  "gemini-2.5-flash":  { input: 0.30,  output: 2.50  },
  "gemini-2.5-pro":    { input: 1.25,  output: 10.00 },
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = MODEL_COSTS[model] ?? MODEL_COSTS["gemini-2.5-flash"];
  return (inputTokens / 1_000_000) * costs.input + (outputTokens / 1_000_000) * costs.output;
}

// Convert Anthropic-style messages to Gemini contents format
function toGeminiContents(messages: Array<{ role: string; content: string }>) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

const FALLBACK_MODEL = "gemini-2.0-flash";

async function callGemini(
  apiKey: string,
  model: string,
  systemText: string,
  contents: unknown[],
  maxOutputTokens: number,
  retries = 2
): Promise<{ res: Response; model: string }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemText }] },
          contents,
          generationConfig: { maxOutputTokens },
        }),
      }
    );

    if (res.status !== 503) return { res, model };

    // On last retry with primary model, switch to fallback
    if (attempt === retries && model !== FALLBACK_MODEL) {
      model = FALLBACK_MODEL;
      attempt = -1; // reset loop for fallback model
      retries = 1;
      continue;
    }

    if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }
  // Unreachable but satisfies TS
  throw new Error("Gemini unreachable");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY not configured. Please add it in Supabase Edge Function secrets." }),
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

    // Build full system instruction text
    let systemText = SYSTEM_PROMPT_CORE;
    if (subjectKnowledge) systemText += `\n\n## SUBJECT KNOWLEDGE BASE\n\n${subjectKnowledge}`;
    if (pyqContext) systemText += `\n\n## PYQ PATTERN ANALYSIS\n\n${pyqContext}`;

    const { res: geminiRes, model: usedModel } = await callGemini(
      apiKey,
      model,
      systemText,
      toGeminiContents(messages),
      max_tokens
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${geminiRes.status}`, detail: errText }),
        { status: geminiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiRes.json();

    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const usageMeta = geminiData.usageMetadata ?? {};
    const inputTokens = usageMeta.promptTokenCount ?? 0;
    const outputTokens = usageMeta.candidatesTokenCount ?? 0;
    const costEstimate = estimateCost(usedModel, inputTokens, outputTokens);

    // Shadow token logging (fire-and-forget)
    supabase.from("mentor_token_usage").insert({
      session_token,
      model: usedModel,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cache_read_tokens: 0,
      cache_creation_tokens: 0,
      cache_hit: false,
      event_type: mode,
      subject_code: subject_code ?? null,
      cost_usd_estimate: costEstimate,
    }).then(() => {});

    return new Response(
      JSON.stringify({
        message: responseText,
        model: usedModel,
        usage: {
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          cache_read_tokens: 0,
          cache_creation_tokens: 0,
          cache_hit: false,
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
