import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are a professional AI support agent for Kuvanta Tech, a software development and technology consultancy. Your name is "KT Support".

Kuvanta Tech specialises in:
- Custom mobile app development (iOS, Android, cross-platform with React Native / Flutter)
- Web application development (React, Next.js, Vue, Node.js backends)
- AI & automation solutions (chatbots, workflow automation, LLM integrations)
- Cloud infrastructure & DevOps (AWS, GCP, Azure, Supabase)
- E-commerce platforms and payment integrations
- UI/UX design and product strategy

Your role is to:
1. Understand what the user needs and ask clarifying questions to gather requirements
2. Provide knowledgeable, helpful responses about technology solutions Kuvanta Tech can offer
3. Gently guide the conversation toward booking a consultation or discovery call
4. Collect the user's name, email, phone number, and project details naturally through conversation
5. Be warm, professional, and concise — avoid overly long responses

Keep responses under 80 words unless the user asks a detailed technical question. Never make up pricing — instead suggest booking a free consultation for quotes. Always stay on topic about technology and Kuvanta Tech services.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return new Response(JSON.stringify({ error: err }), {
        status: openaiRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I could not generate a response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
