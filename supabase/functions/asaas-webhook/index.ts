import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
)

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    console.log('📥 Webhook request received');
    console.log('Method:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    // Read the raw body as text since it's form-urlencoded
    const rawBody = await req.text();
    console.log('📦 Webhook payload:', rawBody);

    // Parse the form data
    const formData = new URLSearchParams(rawBody);
    const dataEncoded = formData.get('data');

    if (!dataEncoded) {
      console.error('❌ No data field in form');
      return new Response(
        JSON.stringify({ error: 'No data field' }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Decode and parse the JSON data
    const dataDecoded = decodeURIComponent(dataEncoded);
    const event = JSON.parse(dataDecoded);

    console.log('🎯 Processing webhook event:', {
      event_type: event.event,
      payment_status: event.payment?.status,
      payment_value: event.payment?.value,
      external_reference: event.payment?.externalReference
    });

    const payment = event.payment;
    if (!payment) {
      console.error('❌ No payment data in webhook');
      return new Response(
        JSON.stringify({ error: 'No payment data' }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    console.log('💳 Payment status:', payment.status);

    if (payment.status === 'RECEIVED' || payment.status === 'CONFIRMED') {
      const userId = payment.externalReference;
      if (!userId) {
        console.error('❌ No user ID in payment reference');
        return new Response(
          JSON.stringify({ error: 'No user ID' }),
          { 
            status: 400,
            headers: corsHeaders
          }
        );
      }

      console.log('👤 Processing payment for user:', userId);
      console.log('💵 Payment amount:', payment.value);

      // Log current user balance
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('❌ Error fetching current balance:', profileError);
        return new Response(
          JSON.stringify({ error: 'Error fetching user balance' }),
          { 
            status: 500,
            headers: corsHeaders
          }
        );
      }

      console.log('💰 Current balance:', currentProfile?.balance || 0);

      // Check if payment was already processed
      const { data: existingPayment, error: checkError } = await supabase
        .from('asaas_payments')
        .select('status')
        .eq('asaas_id', payment.id)
        .single();

      if (checkError && !checkError.message.includes('No rows found')) {
        console.error('❌ Error checking payment status:', checkError);
        return new Response(
          JSON.stringify({ error: 'Error checking payment status' }),
          { 
            status: 500,
            headers: corsHeaders
          }
        );
      }

      if (existingPayment?.status === 'received') {
        console.log('⚠️ Payment already processed, skipping');
        return new Response(
          JSON.stringify({ received: true, status: 'already_processed' }),
          { headers: corsHeaders }
        );
      }

      // Update user balance using RPC function
      const { data: newBalance, error: updateError } = await supabase
        .rpc('increment_balance', {
          amount: payment.value
        });

      if (updateError) {
        console.error('❌ Error updating balance:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error updating balance' }),
          { 
            status: 500,
            headers: corsHeaders
          }
        );
      }

      console.log('✅ Balance updated successfully:', newBalance);

      // Update payment status
      const { error: statusError } = await supabase
        .from('asaas_payments')
        .update({
          status: 'received',
          paid_at: new Date().toISOString()
        })
        .eq('asaas_id', payment.id);

      if (statusError) {
        console.error('❌ Error updating payment status:', statusError);
        return new Response(
          JSON.stringify({ error: 'Error updating payment status' }),
          { 
            status: 500,
            headers: corsHeaders
          }
        );
      }

      console.log('✅ Successfully processed payment');
      return new Response(
        JSON.stringify({ 
          received: true,
          userId,
          amount: payment.value,
          newBalance
        }),
        { headers: corsHeaders }
      );
    }

    // For other statuses, just confirm receipt
    return new Response(
      JSON.stringify({ received: true }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
})