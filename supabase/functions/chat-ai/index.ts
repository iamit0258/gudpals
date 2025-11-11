import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Lang = "hi" | "en";

function systemPromptFor(lang: Lang) {
  return lang === "hi"
    ? "आप एक सहायक AI सहायक हैं। हमेशा उपयोगकर्ता की भाषा में संक्षिप्त और स्पष्ट उत्तर दें।"
    : "You are a helpful assistant. Always respond concisely in the user's language.";
}

async function withRetries<T>(fn: () => Promise<T>, retries = 3) {
  let attempt = 0, delay = 400;
  for (;;) {
    try { return await fn(); }
    catch (e) {
      attempt++;
      const msg = String(e?.message || e);
      // Retry only on transient errors
      const transient = /429|rate|timeout|temporarily|ECONNRESET/i.test(msg);
      if (!transient || attempt > retries) throw e;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

async function chatOpenAI(message: string, lang: Lang) {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) throw new Error("OPENAI_API_KEY missing");
  const res = await withRetries(async () => {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPromptFor(lang) },
          { role: "user", content: message }
        ],
        temperature: 0.6,
        max_tokens: 400
      })
    });
    if (!r.ok) {
      const t = await r.text();
      const err = new Error(`OpenAI error ${r.status}: ${t}`);
      // bubble up so caller can decide to fallback on quota errors
      throw err;
    }
    const data = await r.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  });
  return res;
}

async function chatLovableGemini(message: string, lang: Lang) {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPromptFor(lang) },
        { role: "user", content: message }
      ]
    })
  });
  if (!r.ok) throw new Error(`Lovable AI API error: ${await r.text()}`);
  const data = await r.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, language } = await req.json();
    if (!message) throw new Error("No message provided");

    // crude language pick if not provided
    const lang: Lang =
      language === "hi" || /[\u0900-\u097F]/.test(String(message)) ? "hi" : "en";

    let reply = "";
    let triedOpenAI = false;

    // 1) Try OpenAI first (if key present)
    if (Deno.env.get("OPENAI_API_KEY")) {
      try {
        triedOpenAI = true;
        reply = await chatOpenAI(message, lang);
      } catch (e) {
        const msg = String(e?.message || e);
        const isQuota =
          /insufficient_quota|You exceeded your current quota|billing|429/i.test(msg);
        const isOtherTransient = /rate|timeout|temporarily|ECONNRESET|openai error 5\d{2}/i.test(msg);

        console.warn("OpenAI failed, will fallback. Reason:", msg);

        if (!(isQuota || isOtherTransient)) {
          // Non-quota, non-transient: still fall back, but log explicitly
          console.error("Non-quota OpenAI failure, using fallback:", msg);
        }
      }
    }

    // 2) Fallback to Lovable/Gemini if no reply yet
    if (!reply) {
      reply = await chatLovableGemini(message, lang);
    }

    return new Response(JSON.stringify({ reply, provider: reply && triedOpenAI ? "openai-or-fallback" : "lovable" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: String(error?.message || error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
