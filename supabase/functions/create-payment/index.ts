
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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

    const { productId, quantity = 1, consultationId } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    let lineItems = [];
    let orderAmount = 0;

    if (productId) {
      // Product purchase
      const { data: product } = await supabaseClient
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) throw new Error("Product not found");

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      });
      orderAmount = product.price * quantity;
    }

    if (consultationId) {
      // Astrology consultation payment
      const { data: consultation } = await supabaseClient
        .from('astrology_consultations')
        .select('*, astrologers(*)')
        .eq('id', consultationId)
        .single();

      if (!consultation) throw new Error("Consultation not found");

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Astrology Consultation" },
          unit_amount: Math.round(consultation.total_cost * 100),
        },
        quantity: 1,
      });
      orderAmount = consultation.total_cost;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: {
        user_id: user.id,
        product_id: productId || "",
        consultation_id: consultationId || "",
      }
    });

    // Create order record
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await supabaseService.from("orders").insert({
      user_id: user.id,
      total_amount: orderAmount,
      payment_intent_id: session.id,
      status: "pending",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
