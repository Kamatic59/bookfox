// Edge Function to create a business for authenticated users
// Uses service role to bypass RLS, but validates JWT first

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a client with the user's JWT to verify they're authenticated
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify the user's JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { name, trade_type, business_hours } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'Business name is required (min 2 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role client to bypass RLS
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already has a business
    const { data: existingMember } = await adminClient
      .from('team_members')
      .select('business_id')
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      // User already has a business - fetch it and return success
      const { data: existingBusiness } = await adminClient
        .from('businesses')
        .select('*')
        .eq('id', existingMember.business_id)
        .single();
      
      console.log(`User ${user.id} already has business ${existingMember.business_id}`);
      return new Response(
        JSON.stringify({ business: existingBusiness, existing: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create the business
    const { data: business, error: bizError } = await adminClient
      .from('businesses')
      .insert({
        name: name.trim(),
        trade_type: trade_type || null,
        business_hours: business_hours || null,
      })
      .select()
      .single();

    if (bizError) {
      console.error('Business creation error:', bizError);
      return new Response(
        JSON.stringify({ error: 'Failed to create business', details: bizError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create team member link
    const { error: teamError } = await adminClient
      .from('team_members')
      .insert({
        user_id: user.id,
        business_id: business.id,
        role: 'owner',
      });

    if (teamError) {
      console.error('Team member error:', teamError);
      // Try to clean up the business we just created
      await adminClient.from('businesses').delete().eq('id', business.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to link user to business', details: teamError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created business ${business.id} for user ${user.id}`);

    return new Response(
      JSON.stringify({ business }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
