import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Log the incoming request details
  console.log('Function invoked:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method);
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
    console.log('Processing payment request for amount:', amount);

    if (!amount || isNaN(amount)) {
      console.error('Invalid amount provided:', amount);
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
      console.error('Missing Asaas API key in environment variables');
      throw new Error('Configuration error: Missing API key');
    }

    console.log('Creating payment in Asaas...');
    const paymentResponse = await fetch('https://sandbox.asaas.com/api/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      },
      body: JSON.stringify({
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

    console.log('Generating PIX QR Code...');
    const pixResponse = await fetch(`https://sandbox.asaas.com/api/v3/payments/${paymentData.id}/pixQrCode`, {
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