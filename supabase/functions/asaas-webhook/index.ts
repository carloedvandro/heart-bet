import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const WEBHOOK_SECRET = Deno.env.get('ASAAS_WEBHOOK_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Usar service role key para ter permissões adequadas
const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('asaas-signature')
    if (!signature || !WEBHOOK_SECRET) {
      console.error('❌ Missing webhook signature or secret')
      throw new Error('Unauthorized')
    }

    // Log do payload recebido
    const rawBody = await req.text()
    console.log('📦 Webhook payload:', rawBody)

    let event
    try {
      event = JSON.parse(rawBody)
    } catch (error) {
      console.error('❌ Failed to parse webhook payload:', error)
      throw new Error('Invalid JSON payload')
    }

    console.log('🎯 Processing webhook event:', {
      event_type: event.event,
      payment_status: event.payment?.status,
      payment_value: event.payment?.value,
      external_reference: event.payment?.externalReference
    })

    const payment = event.payment
    if (!payment) {
      console.error('❌ No payment data in webhook')
      throw new Error('No payment data')
    }

    console.log('💳 Payment status:', payment.status)

    // Processar apenas pagamentos RECEIVED
    if (payment.status === 'RECEIVED') {
      const userId = payment.externalReference
      if (!userId) {
        console.error('❌ No user ID in payment reference')
        throw new Error('No user ID')
      }

      console.log('👤 Processing payment for user:', userId)
      console.log('💵 Payment amount:', payment.value)

      // Verificar se o pagamento já foi processado
      const { data: existingPayment, error: checkError } = await supabase
        .from('asaas_payments')
        .select('status')
        .eq('asaas_id', payment.id)
        .single()

      if (checkError) {
        console.error('❌ Error checking payment status:', checkError)
        throw checkError
      }

      if (existingPayment?.status === 'received') {
        console.log('⚠️ Payment already processed, skipping')
        return new Response(
          JSON.stringify({ received: true, status: 'already_processed' }),
          { headers: corsHeaders, status: 200 }
        )
      }

      // Atualizar saldo do usuário usando service role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError)
        throw profileError
      }

      const currentBalance = profile.balance || 0
      const newBalance = currentBalance + payment.value

      console.log('💰 Updating balance:', {
        userId,
        currentBalance,
        paymentAmount: payment.value,
        newBalance
      })

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId)

      if (updateError) {
        console.error('❌ Error updating balance:', updateError)
        throw updateError
      }

      // Registrar no histórico de saldo
      const { error: historyError } = await supabase
        .from('balance_history')
        .insert({
          admin_id: userId,
          user_id: userId,
          operation_type: 'asaas_payment',
          amount: payment.value,
          previous_balance: currentBalance,
          new_balance: newBalance
        })

      if (historyError) {
        console.error('❌ Error recording balance history:', historyError)
        throw historyError
      }

      // Atualizar status do pagamento
      const { error: statusError } = await supabase
        .from('asaas_payments')
        .update({
          status: 'received',
          paid_at: new Date().toISOString()
        })
        .eq('asaas_id', payment.id)

      if (statusError) {
        console.error('❌ Error updating payment status:', statusError)
        throw statusError
      }

      console.log('✅ Successfully processed payment')
      return new Response(
        JSON.stringify({ 
          received: true,
          userId,
          amount: payment.value,
          newBalance
        }),
        { headers: corsHeaders }
      )
    }

    // Para outros status, apenas confirmar recebimento
    return new Response(
      JSON.stringify({ received: true }),
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: corsHeaders }
    )
  }
})