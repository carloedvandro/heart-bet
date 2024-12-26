import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { AsaasPayment } from './types';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function checkPaymentProcessed(paymentId: string): Promise<boolean> {
  const { data } = await supabase
    .from('asaas_payments')
    .select('paid_at')
    .eq('asaas_id', paymentId)
    .single();

  return !!data?.paid_at;
}

export async function processPayment(payment: AsaasPayment) {
  const { externalReference: userId, value: amount, id: asaasId } = payment;

  // Get current balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', userId)
    .single();

  if (!profile) {
    throw new Error('User profile not found');
  }

  // Start transaction
  const { error: updateError } = await supabase
    .from('asaas_payments')
    .update({ 
      status: 'received',
      paid_at: new Date().toISOString()
    })
    .eq('asaas_id', asaasId)
    .eq('status', 'pending')
    .is('paid_at', null);

  if (updateError) {
    console.error('Error updating payment:', updateError);
    return false;
  }

  // Update user balance
  const { error: balanceError } = await supabase
    .from('profiles')
    .update({ balance: profile.balance + amount })
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
      previous_balance: profile.balance,
      new_balance: profile.balance + amount
    });

  if (historyError) {
    console.error('Error recording history:', historyError);
    return false;
  }

  return true;
}