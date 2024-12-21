import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!ASAAS_API_KEY) {
      console.error('ASAAS_API_KEY is not configured')
      throw new Error('API configuration error')
    }

    // Parse request body
    const { amount } = await req.json()
    console.log('Received amount:', amount)

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount provided')
    }

    // Generate payment link using Asaas API
    console.log('Making request to Asaas API')
    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: 'cus_000005113863', // Using sandbox customer ID
        billingType: 'PIX',
        value: amount,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        description: 'Recarga no sistema',
      }),
    })

    const data = await response.json()
    console.log('Asaas API response:', data)

    if (!response.ok) {
      console.error('Error from Asaas API:', data)
      throw new Error(data.message || 'Payment creation failed')
    }

    // Return the payment URL
    return new Response(
      JSON.stringify({
        paymentUrl: data.invoiceUrl || `https://sandbox.asaas.com/i/${data.id}`,
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Function error:', error)
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