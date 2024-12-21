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
  console.log('URL:', req.url)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight request')
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    if (!ASAAS_API_KEY) {
      console.error('❌ ASAAS_API_KEY is not configured')
      throw new Error('API configuration error: Missing ASAAS_API_KEY')
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json()
      console.log('📦 Received request body:', requestBody)
    } catch (error) {
      console.error('❌ Failed to parse request body:', error)
      throw new Error('Invalid request body')
    }

    const { amount } = requestBody
    console.log('💰 Amount:', amount)

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
    console.log('📤 Request payload:', payload)

    let asaasResponse;
    try {
      asaasResponse = await fetch(`${ASAAS_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      console.error('❌ Network error calling Asaas API:', error)
      throw new Error('Failed to connect to Asaas API')
    }

    if (!asaasResponse.ok) {
      const errorText = await asaasResponse.text()
      console.error('❌ Error response from Asaas:', {
        status: asaasResponse.status,
        statusText: asaasResponse.statusText,
        body: errorText
      })
      throw new Error(`Asaas API error: ${asaasResponse.status} ${asaasResponse.statusText}`)
    }

    const data = await asaasResponse.json()
    console.log('✅ Asaas API response:', data)

    if (!data.invoiceUrl) {
      console.error('❌ No invoice URL in response:', data)
      throw new Error('Invalid payment response')
    }

    console.log('✅ Successfully generated payment link')
    
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
        status: error.message.includes('API configuration') ? 500 : 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})