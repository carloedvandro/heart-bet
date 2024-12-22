import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Permissive CORS headers to allow all requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  console.log('🎯 Asaas webhook received')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('👉 Handling CORS preflight request')
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing environment variables')
      throw new Error('Missing environment variables')
    }

    // Use service role key for admin privileges
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const payload = await req.json()
    console.log('📦 Received webhook payload:', payload)

    // Handle different event types
    if (payload.event === 'PAYMENT_RECEIVED' || payload.event === 'PAYMENT_CONFIRMED') {
      const payment = payload.payment
      console.log('💰 Processing payment:', payment)

      // Extract user_id from externalReference or description
      const userId = payment.externalReference || 
                    payment.description?.match(/User ID: ([^\s]+)/)?.[1]

      if (!userId) {
        console.error('❌ No user ID found in payment')
        throw new Error('No user ID found in payment')
      }

      console.log('👤 Processing payment for user:', userId)

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
        console.error('❌ Payment not found in database')
        throw new Error('Payment not found in database')
      }

      console.log('✅ Payment found:', asaasPayment)

      // Update user balance - convert from cents to real
      const amountInReal = payment.value / 100
      console.log('💵 Updating balance with amount:', amountInReal)

      const { error: balanceError } = await supabase.rpc(
        'increment_balance',
        { amount: amountInReal }
      )

      if (balanceError) {
        console.error('❌ Error updating balance:', balanceError)
        throw balanceError
      }

      console.log('✅ Balance updated successfully')
    }

    // Always return 200 to acknowledge receipt
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: corsHeaders,
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    // Still return 200 to acknowledge receipt, even on error
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: corsHeaders,
        status: 200 
      }
    )
  }
})