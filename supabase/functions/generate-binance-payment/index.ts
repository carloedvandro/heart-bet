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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        headers: corsHeaders,
        status: 204
      });
    }

    const start = Date.now();
    console.log('Starting payment generation at:', new Date().toISOString());

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request with timeout
    const body = await Promise.race([
      req.json(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      )
    ]) as { amount: number; user_id: string };

    console.log('Request body parsed:', body);
    const { amount, user_id } = body;

    // Validate input
    if (!amount || !user_id) {
      console.error('Missing parameters:', { amount, user_id });
      return handleError(
        { message: 'Missing required parameters', details: { amount, user_id } },
        400
      );
    }

    // Create payment record with timeout
    const { data: payment, error: paymentError } = await Promise.race([
      supabaseClient
        .from('binance_payments')
        .insert({
          user_id,
          amount,
          status: 'pending'
        })
        .select()
        .single(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ]) as any;

    if (paymentError) {
      return handleError(paymentError);
    }

    const end = Date.now();
    console.log(`Payment record created successfully in ${end - start}ms:`, payment);

    return new Response(
      JSON.stringify(payment),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    return handleError(error);
  }
})