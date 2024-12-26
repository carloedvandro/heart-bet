import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Database } from '../utils/types.ts';
import { corsHeaders } from './cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export async function processPayment(payload: any) {
  try {
    console.log('Processing payment:', payload);

    const paymentId = payload.payment.id;
    const userId = payload.payment.customer;
    const amount = parseFloat(payload.payment.value);
    const status = payload.payment.status;

    // Check if payment was already processed
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', paymentId)
      .single();

    if (existingPayment) {
      console.log('Payment already processed:', paymentId);
      return new Response(
        JSON.stringify({ 
          status: 'success', 
          message: 'Payment already processed' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Begin transaction by inserting payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        payment_id: paymentId,
        user_id: userId,
        amount: amount,
        status: status
      })
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    // If payment is confirmed, update user balance
    if (status === 'CONFIRMED' || status === 'RECEIVED') {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      const currentBalance = profile?.balance || 0;
      const newBalance = currentBalance + amount;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // Record the balance update in history
      const { error: historyError } = await supabase
        .from('balance_history')
        .insert({
          admin_id: userId,
          user_id: userId,
          operation_type: 'asaas_payment',
          amount: amount,
          previous_balance: currentBalance,
          new_balance: newBalance
        });

      if (historyError) {
        throw historyError;
      }
    }

    return new Response(
      JSON.stringify({ 
        status: 'success', 
        message: 'Payment processed successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}