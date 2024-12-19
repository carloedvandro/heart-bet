import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const handleError = (error: any, status = 500) => {
  console.error('Error:', error);
  return new Response(
    JSON.stringify({
      error: error.message || 'Internal server error',
      details: error
    }),
    {
      status,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    }
  );
};

serve(async (req) => {
  console.log('Received request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
      status: 204
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return handleError({ message: 'Method not allowed' }, 405);
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    );

    // Parse request body
    let body;
    try {
      const bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      body = JSON.parse(bodyText);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return handleError({ message: 'Invalid JSON in request body' }, 400);
    }

    console.log('Parsed request body:', body);
    const { amount, user_id } = body;

    // Validate input
    if (!amount || !user_id) {
      console.error('Missing parameters:', { amount, user_id });
      return handleError(
        { message: 'Missing required parameters', details: { amount, user_id } },
        400
      );
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('binance_payments')
      .insert({
        user_id,
        amount,
        status: 'pending'
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Database error:', paymentError);
      return handleError(paymentError);
    }

    console.log('Payment record created:', payment);

    return new Response(
      JSON.stringify(payment),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return handleError(error);
  }
})