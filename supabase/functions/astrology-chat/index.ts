
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createRemoteJWKSet, jwtVerify } from "https://deno.land/x/jose@v5.2.0/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify Clerk JWT token
async function verifyClerkToken(authHeader: string | null): Promise<string> {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const clerkSecretKey = Deno.env.get('CLERK_SECRET_KEY');
  
  if (!clerkSecretKey) {
    throw new Error('CLERK_SECRET_KEY not configured');
  }

  try {
    const clerkFrontendApi = Deno.env.get('CLERK_FRONTEND_API');
    if (!clerkFrontendApi) {
      throw new Error('CLERK_FRONTEND_API not configured');
    }

    const jwksUrl = `https://${clerkFrontendApi}/.well-known/jwks.json`;
    const JWKS = createRemoteJWKSet(new URL(jwksUrl));
    const { payload } = await jwtVerify(token, JWKS);
    
    if (!payload.sub) {
      throw new Error('Invalid token: missing subject');
    }

    return payload.sub;
  } catch (error) {
    console.error('Clerk token verification failed:', error);
    throw new Error('Invalid or expired authentication token');
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify Clerk authentication
    const authHeader = req.headers.get("Authorization");
    const userId = await verifyClerkToken(authHeader);
    
    console.log('Authenticated user:', userId);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { consultationId, message, messageType = "text" } = await req.json();

    // Verify user has access to this consultation
    const { data: consultation } = await supabaseClient
      .from('astrology_consultations')
      .select('*, astrologers(*)')
      .eq('id', consultationId)
      .single();

    if (!consultation) throw new Error("Consultation not found");

    const isParticipant = consultation.user_id === userId || 
                         consultation.astrologers.user_id === userId;

    if (!isParticipant) throw new Error("Unauthorized");

    // Insert chat message
    const { data: chatMessage, error } = await supabaseClient
      .from('astrology_chats')
      .insert({
        consultation_id: consultationId,
        sender_id: userId,
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
