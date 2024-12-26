import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from "../../_shared/cors.ts"
import { AsaasPayment } from "./types.ts"

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function processPayment(payment: AsaasPayment) {
  try {
    console.log('Processing payment:', payment);

    // Check if payment was already processed
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', payment.id)
      .maybeSingle();

    if (existingPayment) {
      console.log('Payment already processed:', payment.id);
      return {
        status: 'success',
        message: 'Payment already processed'
      };
    }

    // Begin transaction by inserting payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .insert({
        payment_id: payment.id,
        user_id: payment.externalReference,
        amount: payment.value,
        status: payment.status
      })
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    // If payment is confirmed, update user balance
    if (payment.status === 'RECEIVED') {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', payment.externalReference)
        .single();

      if (profileError) {
        throw profileError;
      }

      const currentBalance = profile?.balance || 0;
      const newBalance = currentBalance + payment.value;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', payment.externalReference);

      if (updateError) {
        throw updateError;
      }

      // Record the balance update in history
      const { error: historyError } = await supabase
        .from('balance_history')
        .insert({
          admin_id: payment.externalReference,
          user_id: payment.externalReference,
          operation_type: 'asaas_payment',
          amount: payment.value,
          previous_balance: currentBalance,
          new_balance: newBalance
        });

      if (historyError) {
        throw historyError;
      }
    }

    return {
      status: 'success',
      message: 'Payment processed successfully'
    };

  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}