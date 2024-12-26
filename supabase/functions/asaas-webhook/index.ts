import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
)

async function checkPaymentProcessed(asaasId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('asaas_payments')
    .select('status, paid_at')
    .eq('asaas_id', asaasId)
    .single();

  if (error) {
    console.error('Error checking payment status:', error);
    return false;
  }

  return data?.paid_at !== null;
}

async function processPayment(userId: string, amount: number, asaasId: string) {
  // Start a transaction
  const { data: payment, error: updateError } = await supabase
    .from('asaas_payments')
    .update({ 
      status: 'received',
      paid_at: new Date().toISOString()
    })
    .eq('asaas_id', asaasId)
    .eq('status', 'pending')
    .select()
    .single();

  if (updateError || !payment) {
    console.error('Error updating payment status:', updateError);
    return false;
  }

  // Update user balance
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return false;
  }

  const newBalance = (profile?.balance || 0) + amount;

  const { error: balanceError } = await supabase
    .from('profiles')
    .update({ balance: newBalance })
    .eq('id', userId);

  if (balanceError) {
    console.error('Error updating balance:', balanceError);
    return false;
  }

  // Record in balance history
  const { error: historyError } = await supabase
    .from('balance_history')
    .insert({
      admin_id: userId,
      user_id: userId,
      operation_type: 'asaas_payment',
      amount: amount,
      previous_balance: profile?.balance || 0,
      new_balance: newBalance
    });

  if (historyError) {
    console.error('Error recording balance history:', historyError);
    return false;
  }

  return true;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    console.log('📥 Webhook request received');
    console.log('Method:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    const rawBody = await req.text();
    console.log('📦 Webhook payload:', rawBody);

    const formData = new URLSearchParams(rawBody);
    const dataEncoded = formData.get('data');

    if (!dataEncoded) {
      console.error('❌ No data field in form');
      return new Response(
        JSON.stringify({ error: 'No data field' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    const dataDecoded = decodeURIComponent(dataEncoded);
    const event = JSON.parse(dataDecoded);
    const payment = event.payment;

    if (!payment) {
      console.error('❌ No payment data in webhook');
      return new Response(
        JSON.stringify({ error: 'No payment data' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    console.log('🎯 Processing webhook event:', {
      event_type: event.event,
      payment_status: payment.status,
      payment_value: payment.value,
      external_reference: payment.externalReference
    });

    if (payment.status === 'RECEIVED') {
      const userId = payment.externalReference;
      if (!userId) {
        console.error('❌ No user ID in payment reference');
        return new Response(
          JSON.stringify({ error: 'No user ID' }),
          { headers: corsHeaders, status: 400 }
        );
      }

      console.log('👤 Processing payment for user:', userId);
      console.log('💵 Payment amount:', payment.value);

      // Check if payment was already processed
      const isProcessed = await checkPaymentProcessed(payment.id);
      if (isProcessed) {
        console.log('⚠️ Payment already processed, skipping');
        return new Response(
          JSON.stringify({ received: true, status: 'already_processed' }),
          { headers: corsHeaders }
        );
      }

      // Process the payment
      const success = await processPayment(userId, payment.value, payment.id);
      if (!success) {
        return new Response(
          JSON.stringify({ error: 'Error processing payment' }),
          { headers: corsHeaders, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ received: true }),
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
      { headers: corsHeaders, status: 500 }
    );
  }
})