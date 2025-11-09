import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { createRemoteJWKSet, jwtVerify } from "https://deno.land/x/jose@v5.2.0/index.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify Clerk authentication
    const authHeader = req.headers.get("Authorization");
    const authenticatedUserId = await verifyClerkToken(authHeader);
    
    const { userId, displayName, email, phoneNumber, photoUrl } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    // CRITICAL: Verify the authenticated user matches the userId being synced
    if (authenticatedUserId !== userId) {
      throw new Error('Unauthorized: Cannot sync profile for another user');
    }

    console.log('Syncing profile for authenticated user:', userId);

    // Create Supabase client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check if profile exists
    const { data: existingProfile, error: selectError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (selectError) {
      console.error('Error checking existing profile:', selectError);
      throw selectError;
    }

    const profileData = {
      id: userId,
      display_name: displayName,
      email: email,
      phone_number: phoneNumber,
      photo_url: photoUrl,
      last_login_at: new Date().toISOString(),
      provider: 'clerk',
    };

    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          display_name: profileData.display_name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          photo_url: profileData.photo_url,
          last_login_at: profileData.last_login_at,
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({ success: true, action: 'updated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Create new profile
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert(profileData);

      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw insertError;
      }

      return new Response(
        JSON.stringify({ success: true, action: 'created' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('Error in sync-clerk-profile:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
