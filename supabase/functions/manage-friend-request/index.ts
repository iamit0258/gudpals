
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

    const { action, requestId, receiverId, message } = await req.json();

    if (action === "send") {
      // Send friend request
      const { data: request, error } = await supabaseClient
        .from('friend_requests')
        .insert({
          sender_id: userId,
          receiver_id: receiverId,
          message,
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification to receiver
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({
          userId: receiverId,
          title: "New Friend Request",
          message: `You have a new friend request`,
          type: "info",
          actionUrl: "/friends",
        }),
      });

      return new Response(JSON.stringify(request), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "accept" || action === "reject") {
      // Update friend request status
      const { data: request, error } = await supabaseClient
        .from('friend_requests')
        .update({ status: action === "accept" ? "accepted" : "rejected" })
        .eq('id', requestId)
        .eq('receiver_id', userId)
        .select()
        .single();

      if (error) throw error;

      // If accepted, create connection
      if (action === "accept") {
        await supabaseClient
          .from('user_connections')
          .insert({
            user_id_1: request.sender_id,
            user_id_2: userId,
          });

        // Notify sender
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            userId: request.sender_id,
            title: "Friend Request Accepted",
            message: `Your friend request has been accepted`,
            type: "success",
            actionUrl: "/friends",
          }),
        });
      }

      return new Response(JSON.stringify(request), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    console.error('Friend request error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process friend request. Please try again.' }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
