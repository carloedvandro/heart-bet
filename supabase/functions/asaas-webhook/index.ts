import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  console.log('🎯 Asaas webhook received:', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('👉 Handling CORS preflight request')
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log('❌ Invalid method:', req.method)
    return new Response(
      JSON.stringify({ received: true, error: 'Only POST requests are allowed' }),
      { 
        status: 200, // Always return 200 as per Asaas docs
        headers: corsHeaders 
      }
    )
  }

  try {
    // Log all headers for debugging
    console.log('📨 Received headers:', Array.from(req.headers.entries()))

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing environment variables:', { 
        hasUrl: !!SUPABASE_URL, 
        hasKey: !!SUPABASE_SERVICE_ROLE_KEY 
      })
      throw new Error('Missing environment variables')
    }

    console.log('🔑 Creating Supabase client with service role')
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const payload = await req.json()
    console.log('📦 Received webhook payload:', payload)

    if (payload.event === 'PAYMENT_RECEIVED' || payload.event === 'PAYMENT_CONFIRMED') {
      const payment = payload.payment
      console.log('💰 Processing payment:', payment)

      // Extract user_id from externalReference
      const userId = payment.externalReference

      if (!userId) {
        console.error('❌ No user ID found in payment')
        throw new Error('No user ID found in payment')
      }

      console.log('👤 Processing payment for user:', userId)

      // The amount is already in reais, no need to convert from cents
      const amountInReal = payment.value
      console.log('💵 Payment amount in reais:', amountInReal)

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
        { amount: amountInReal }
      )

      if (balanceError) {
        console.error('❌ Error updating balance:', balanceError)
        throw balanceError
      }

      // Update payment status in our database
      const { error: paymentError } = await supabase
        .from('asaas_payments')
        .update({
          status: 'received',
          paid_at: new Date().toISOString()
        })
        .eq('asaas_id', payment.id)

      if (paymentError) {
        console.error('❌ Error updating payment status:', paymentError)
        console.log('⚠️ Payment status update failed but balance was updated')
      }

      console.log('✅ Payment processed successfully')
    }

    // Always return 200 to acknowledge receipt
    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: corsHeaders,
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    // Still return 200 to acknowledge receipt, even on error
    return new Response(
      JSON.stringify({ received: true, error: error.message }),
      { 
        headers: corsHeaders,
        status: 200 
      }
    )
  }
})