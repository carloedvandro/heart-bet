import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'

serve(async (req) => {
  console.log('=== Request received ===')
  console.log('Method:', req.method)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    if (!ASAAS_API_KEY) {
      console.error('❌ ASAAS_API_KEY is not configured')
      throw new Error('API configuration error')
    }

    // Parse request body
    const { amount } = await req.json()
    console.log('Received amount:', amount)

    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount provided:', amount)
      throw new Error('Invalid amount provided')
    }

    // Generate payment using Asaas API
    console.log('📡 Making request to Asaas API...')
    const payload = {
      customer: 'cus_000005113863',
      billingType: 'PIX',
      value: amount,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Recarga no sistema'
    }
    console.log('Request payload:', payload)

    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log('✅ Asaas API response:', data)

    if (!response.ok) {
      console.error('❌ Error from Asaas API:', data)
      throw new Error(data.message || 'Payment creation failed')
    }

    if (!data.invoiceUrl) {
      console.error('❌ No invoice URL in response:', data)
      throw new Error('Invalid payment response')
    }

    console.log('✅ Successfully generated payment link')
    
    // Return the payment URL with CORS headers
    return new Response(
      JSON.stringify({
        paymentUrl: data.invoiceUrl,
      }),
      {
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('❌ Function error:', error)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack,
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})