
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

    const { action, requestId, receiverId, message } = await req.json();

    if (action === "send") {
      // Send friend request
      const { data: request, error } = await supabaseClient
        .from('friend_requests')
        .insert({
          sender_id: user.id,
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
        .eq('receiver_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // If accepted, create connection
      if (action === "accept") {
        await supabaseClient
          .from('user_connections')
          .insert({
            user_id_1: request.sender_id,
            user_id_2: user.id,
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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
