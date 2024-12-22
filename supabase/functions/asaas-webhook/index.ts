import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  console.log('🎯 Asaas webhook received')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: corsHeaders 
      }
    )
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const payload = await req.json()
    console.log('📦 Received webhook payload:', payload)

    // Handle different event types
    if (payload.event === 'PAYMENT_RECEIVED' || payload.event === 'PAYMENT_CONFIRMED') {
      const payment = payload.payment
      console.log('💰 Processing payment:', payment)

      // Get the payment record from our database
      const { data: asaasPayment, error: paymentError } = await supabase
        .from('asaas_payments')
        .update({
          status: 'received',
          paid_at: new Date().toISOString()
        })
        .eq('asaas_id', payment.id)
        .select('user_id, amount')
        .single()

      if (paymentError) {
        console.error('❌ Error updating payment:', paymentError)
        throw paymentError
      }

      if (!asaasPayment) {
        throw new Error('Payment not found in database')
      }

      console.log('✅ Payment found:', asaasPayment)

      // Update user balance
      const { error: balanceError } = await supabase.rpc(
        'increment_balance',
        { amount: asaasPayment.amount }
      )

      if (balanceError) {
        console.error('❌ Error updating balance:', balanceError)
        throw balanceError
      }

      console.log('✅ Balance updated successfully')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: corsHeaders,
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: corsHeaders,
        status: 500
      }
    )
  }
})