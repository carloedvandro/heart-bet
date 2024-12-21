import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );
  }

  try {
    const { amount } = await req.json();
    
    if (!amount || isNaN(amount)) {
      return new Response(
        JSON.stringify({ error: 'Amount is required and must be a number' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const asaasApiKey = Deno.env.get('ASAAS_API_KEY');
    if (!asaasApiKey) {
      throw new Error('Configuration error: Missing ASAAS_API_KEY');
    }

    console.log('Creating payment in Asaas...', { amount });
    
    const paymentResponse = await fetch('https://api.asaas.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      },
      body: JSON.stringify({
        customer: 'cus_000005113863',
        billingType: 'PIX',
        value: amount,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `Recarga de R$ ${amount.toFixed(2)}`,
      })
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('Asaas payment creation failed:', {
        status: paymentResponse.status,
        statusText: paymentResponse.statusText,
        body: errorText
      });
      throw new Error(`Failed to create payment: ${paymentResponse.statusText}`);
    }

    const paymentData = await paymentResponse.json();
    console.log('Payment created successfully:', paymentData);

    const pixResponse = await fetch(`https://api.asaas.com/v3/payments/${paymentData.id}/pixQrCode`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      }
    });

    if (!pixResponse.ok) {
      const errorText = await pixResponse.text();
      console.error('PIX QR Code generation failed:', {
        status: pixResponse.status,
        statusText: pixResponse.statusText,
        body: errorText
      });
      throw new Error('Failed to generate PIX QR Code');
    }

    const pixData = await pixResponse.json();
    console.log('PIX QR Code generated successfully');

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
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});