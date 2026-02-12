
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Function 'voice-assistant' loaded");

const ZODIAC_SIGNS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
    'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

// --- KNOWLEDGE BASE ---
const GUDPALS_KNOWLEDGE = `
About GUDPALS:
- **Mission**: To reduce loneliness and help senior citizens stay socially connected, active, and mentally engaged.
- **Founder**: Amit (Final year B.Tech student).
- **Core Features**:
  1. **Sessions**: Live interactive video sessions (Yoga, Digital Literacy, Tambola, Cooking).
  2. **Friend Chats**: Connect with other seniors nearby.
  3. **Voice Assistant (Niva)**: You! A helpful companion to navigate the app.
  4. **Employment**: Part-time jobs suitable for seniors.
  5. **Travel**: Senior-friendly travel packages.
  6. **Astrology**: Daily horoscopes.
- **Supported Languages**: English and Hindi.
`;

// --- HELPER FUNCTIONS ---
function getZodiacSign(text: string): string | null {
    const lowerText = text.toLowerCase();
    return ZODIAC_SIGNS.find(sign => lowerText.includes(sign)) || null;
}

async function getUpcomingSessions(supabase: any) {
    const { data } = await supabase
        .from('activities')
        .select('title, start_time, activity_type, instructor')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3);

    if (!data || data.length === 0) return "No upcoming sessions found.";
    return data.map((s: any) => `- ${s.title} (${s.activity_type}) at ${new Date(s.start_time).toLocaleString()}${s.instructor ? `, taught by ${s.instructor}` : ''}`).join('\n');
}

async function getJobs(supabase: any) {
    const { data } = await supabase
        .from('employment_opportunities')
        .select('title, location, job_type')
        .eq('is_active', true)
        .limit(3);

    if (!data || data.length === 0) return "No job openings currently.";
    return data.map((j: any) => `- ${j.title} (${j.job_type}) in ${j.location}`).join('\n');
}

async function getTravelPlans(supabase: any) {
    const { data } = await supabase
        .from('travel_packages')
        .select('title, destination, duration_days')
        .eq('is_active', true)
        .limit(2);

    if (!data || data.length === 0) return "No travel packages available right now.";
    return data.map((t: any) => `- ${t.title} to ${t.destination} (${t.duration_days} days)`).join('\n');
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const bodyText = await req.text();
        if (!bodyText) {
            throw new Error("Request body is empty");
        }
        const body = JSON.parse(bodyText);
        const { action, message, language, text } = body;

        console.log(`Received request: action=${action}`);

        // Initialize Supabase Client
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
        const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

        // --- ACTION: CHAT (Groq) ---
        if (action === 'chat') {
            const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

            if (!GROQ_API_KEY) {
                console.warn("GROQ_API_KEY not found in environment secrets");
                throw new Error("Missing GROQ_API_KEY in Supabase Secrets");
            }

            console.log("Calling Groq API...");

            // 0. Manual "Fast Path" for common questions (Bypasses AI for speed/reliability)
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes('who created') || lowerMsg.includes('founder') || lowerMsg.includes('developer')) {
                return new Response(JSON.stringify({ reply: "GUDPALS was created by Amit, a final year B.Tech student." }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
            if (lowerMsg.includes('what is gudpals') || lowerMsg.includes('about gudpals')) {
                return new Response(JSON.stringify({ reply: "GUDPALS is a web application designed to help senior citizens stay socially connected, learn new skills, and find employment." }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
            if (lowerMsg.includes('mission') || lowerMsg.includes('purpose')) {
                return new Response(JSON.stringify({ reply: "Our mission is to reduce loneliness and help senior citizens lead active, engaged lives." }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            // 1. Fetch Dynamic Context (Parallel)
            let dynamicContext = "";
            let horoscopeContext = "";

            if (supabase) {
                try {
                    const [sessions, jobs, travel] = await Promise.all([
                        getUpcomingSessions(supabase).catch(e => `Error fetching sessions: ${e.message}`),
                        getJobs(supabase).catch(e => `Error fetching jobs: ${e.message}`),
                        getTravelPlans(supabase).catch(e => `Error fetching travel: ${e.message}`)
                    ]);

                    dynamicContext = `
CURRENT APP DATA:
[Upcoming Sessions]
${sessions}

[Employment Opportunities]
${jobs}

[Travel Packages]
${travel}
`;
                } catch (dbError) {
                    console.error("Error fetching dynamic context:", dbError);
                    dynamicContext = "Error fetching real-time data. Please rely on static knowledge.";
                }

                // Check for Zodiac context
                try {
                    const zodiacSign = getZodiacSign(message);
                    if (zodiacSign) {
                        console.log(`Detected zodiac sign: ${zodiacSign}, fetching data...`);
                        const formattedSign = zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1);
                        const { data } = await supabase
                            .from('daily_horoscopes')
                            .select('horoscope_text, date')
                            .ilike('sign', formattedSign)
                            .order('date', { ascending: false })
                            .limit(1)
                            .maybeSingle();

                        if (data?.horoscope_text) {
                            horoscopeContext = `\n[Horoscope for ${formattedSign}]\n"${data.horoscope_text}"\n`;
                        } else {
                            horoscopeContext = `\n[SYSTEM NOTE: No horoscope found in database for ${formattedSign}. Advise the user to check back later or use the Astrology page.]\n`;
                        }
                    }
                } catch (horoscopeError) {
                    console.error("Error fetching horoscope:", horoscopeError);
                }
            }

            // 2. Build System Prompt & Messages
            const systemPrompt = `
            You are **Niva**, the intelligent and empathetic AI assistant for **GUDPALS** (powered by Project A intelligence).
            
            **YOUR PERSONA:**
            - **Professional & Warm**: You are speaking to senior citizens, so be respectful, clear, and encouraging.
            - **Adaptive Length**: 
              - For simple greetings or confirmations, be **concise** (1-2 sentences).
              - For explanations (e.g., how to use a feature, health tips, stories), provide a **detailed and helpful** response, but keep it easy to follow.
            - **Context-Aware**: Always prioritize the provided GUDPALS knowledge and real-time data.

            **STATIC KNOWLEDGE:**
            ${GUDPALS_KNOWLEDGE}

            **REAL-TIME CONTEXT:**
            ${dynamicContext}
            ${horoscopeContext}

            **INSTRUCTIONS:**
            - If the user asks about sessions/jobs/travel, use the "REAL-TIME CONTEXT" to answer specifically.
            - If the user asks about the app or founder, use "STATIC KNOWLEDGE".
            - IMPORTANT: If a [Horoscope] is provided, read the entire horoscope text provided in the quotes. 
            - If [SYSTEM NOTE] says horoscope is missing, politely explain that the stars haven't spoken yet for that sign today.
            - Avoid unnecessary filler phrases, but remain polite.
            `;

            const groqResponse = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `(Language: ${language || 'English'}) ${message}` }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const data = await groqResponse.json();

            if (data.error) {
                console.error("Groq API Error:", data.error);
                throw new Error("Groq Error: " + (data.error.message || 'Unknown error'));
            }

            const reply = data.choices?.[0]?.message?.content || "I'm sorry, I'm having trouble connecting right now.";

            return new Response(JSON.stringify({ reply }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // --- ACTION: TTS (ElevenLabs) ---
        if (action === 'tts') {
            const ELEVEN_LABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY');

            if (!ELEVEN_LABS_API_KEY) {
                // Return descriptive error even if secret is missing
                throw new Error("Missing ELEVEN_LABS_API_KEY in Secrets");
            }

            const VOICE_ID = 'kiaJRdXJzloFWi6AtFBf'; // Project A Voice (Custom/New)

            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVEN_LABS_API_KEY,
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 } // Project A settings
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`ElevenLabs Error: ${errorText}`);
            }

            const audioArrayBuffer = await response.arrayBuffer();
            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioArrayBuffer)));

            return new Response(JSON.stringify({ audioContent: base64Audio }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Edge Function Error:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
