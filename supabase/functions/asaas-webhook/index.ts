import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const WEBHOOK_SECRET = Deno.env.get('ASAAS_WEBHOOK_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_ANON_KEY!
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

    // Log the raw request body for debugging
    const rawBody = await req.text()
    console.log('📦 Received webhook payload:', rawBody)

    let event
    try {
      event = JSON.parse(rawBody)
    } catch (error) {
      console.error('❌ Failed to parse webhook payload:', error)
      throw new Error('Invalid JSON payload')
    }

    console.log('🎯 Processing webhook event:', event)

    const payment = event.payment
    if (!payment) {
      console.error('❌ No payment data in webhook')
      throw new Error('No payment data')
    }

    console.log('💳 Payment status:', payment.status)

    // Only process RECEIVED payments
    if (payment.status === 'RECEIVED') {
      const userId = payment.externalReference
      if (!userId) {
        console.error('❌ No user ID in payment reference')
        throw new Error('No user ID')
      }

      console.log('👤 Processing payment for user:', userId)

      // Use the payment value exactly as received from Asaas
      const amount = payment.value
      console.log('💵 Payment amount:', amount)

      // First check if this payment was already processed
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

      // Update user balance
      const { error: balanceError } = await supabase.rpc(
        'increment_balance',
        { amount: amount }
      )

      if (balanceError) {
        console.error('❌ Error updating balance:', balanceError)
        throw balanceError
      }

      // Update payment status
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
        JSON.stringify({ received: true }),
        { headers: corsHeaders }
      )
    }

    // For other statuses, just acknowledge receipt
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