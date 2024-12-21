import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received request to generate Asaas payment link')
    
    // Parse request body
    const { amount } = await req.json()
    console.log('Requested amount:', amount)

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount')
    }

    if (!ASAAS_API_KEY) {
      throw new Error('ASAAS_API_KEY not configured')
    }

    console.log('Creating payment in Asaas...')
    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: 'cus_000005113863',
        billingType: 'PIX',
        value: amount,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 24h from now
      }),
    })

    const data = await response.json()
    console.log('Asaas API response:', data)

    if (!response.ok) {
      console.error('Asaas API error:', data)
      throw new Error(data.message || 'Failed to create payment')
    }

    // Return the payment URL
    return new Response(
      JSON.stringify({
        paymentUrl: `https://sandbox.asaas.com/i/${data.id}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error generating payment link:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})