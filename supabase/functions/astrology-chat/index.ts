
import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) throw new Error("User not authenticated");

    const { consultationId, message, messageType = "text" } = await req.json();

    // Verify user has access to this consultation
    const { data: consultation } = await supabaseClient
      .from('astrology_consultations')
      .select('*, astrologers(*)')
      .eq('id', consultationId)
      .single();

    if (!consultation) throw new Error("Consultation not found");

    const isParticipant = consultation.user_id === user.id ||
      consultation.astrologers.user_id === user.id;

    if (!isParticipant) throw new Error("Unauthorized");

    // Insert chat message
    const { data: chatMessage, error } = await supabaseClient
      .from('astrology_chats')
      .insert({
        consultation_id: consultationId,
        sender_id: user.id,
        message,
        message_type: messageType,
      })
      .select()
      .single();

    if (error) throw error;

    // If consultation is not active, mark it as active
    if (consultation.status === 'pending') {
      await supabaseClient
        .from('astrology_consultations')
        .update({
          status: 'active',
          started_at: new Date().toISOString()
        })
        .eq('id', consultationId);
    }

    return new Response(JSON.stringify(chatMessage), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
