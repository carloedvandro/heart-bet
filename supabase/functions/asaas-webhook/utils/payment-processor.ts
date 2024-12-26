import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { AsaasPayment } from './types.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function checkPaymentProcessed(paymentId: string): Promise<boolean> {
  const { data } = await supabase
    .from('payments')
    .select('id')
    .eq('payment_id', paymentId)
    .single();

  return !!data;
}

export async function processPayment(payment: AsaasPayment): Promise<boolean> {
  const { id: paymentId, externalReference: userId, value: amount } = payment;

  try {
    // Start transaction by inserting payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        payment_id: paymentId,
        user_id: userId,
        amount: amount,
        status: 'completed'
      });

    if (paymentError) {
      if (paymentError.code === '23505') { // Unique violation
        console.log('Payment already processed (unique constraint)');
        return false;
      }
      throw paymentError;
    }

    // Get current balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error('User profile not found');

    console.log('💰 Current balance:', profile.balance);

    // Update user balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ balance: profile.balance + amount })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Record in balance history
    const { error: historyError } = await supabase
      .from('balance_history')
      .insert({
        admin_id: userId,
        user_id: userId,
        operation_type: 'asaas_payment',
        amount: amount,
        previous_balance: profile.balance,
        new_balance: profile.balance + amount
      });

    if (historyError) throw historyError;

    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    // Try to rollback payment record if possible
    await supabase
      .from('payments')
      .delete()
      .eq('payment_id', paymentId);
    return false;
  }
}