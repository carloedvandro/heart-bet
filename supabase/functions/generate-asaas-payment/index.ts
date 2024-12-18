import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount } = await req.json()
    console.log('Processing Asaas payment request for amount:', amount)

    if (!amount || isNaN(amount)) {
      return new Response(
        JSON.stringify({ error: 'Amount is required and must be a number' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const asaasApiKey = Deno.env.get('ASAAS_API_KEY')
    if (!asaasApiKey) {
      throw new Error('Missing Asaas API key')
    }

    // Criar cobrança no Asaas
    const paymentResponse = await fetch('https://api.asaas.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      },
      body: JSON.stringify({
        billingType: 'PIX',
        value: amount,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Vencimento em 24h
        description: `Recarga de R$ ${amount.toFixed(2)}`,
      })
    })

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json()
      console.error('Asaas API error:', errorData)
      throw new Error('Failed to create Asaas payment')
    }

    const paymentData = await paymentResponse.json()
    console.log('Payment created successfully:', paymentData)

    // Gerar QR Code PIX
    const pixResponse = await fetch(`https://api.asaas.com/v3/payments/${paymentData.id}/pixQrCode`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      }
    })

    if (!pixResponse.ok) {
      const errorData = await pixResponse.json()
      console.error('Error generating PIX QR Code:', errorData)
      throw new Error('Failed to generate PIX QR Code')
    }

    const pixData = await pixResponse.json()
    console.log('PIX QR Code generated successfully')

    return new Response(
      JSON.stringify({
        success: true,
        payment: {
          id: paymentData.id,
          value: paymentData.value,
          status: paymentData.status,
          dueDate: paymentData.dueDate,
          pixQrCode: pixData.encodedImage,
          pixKey: pixData.payload
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})