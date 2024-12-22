import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer, x-supabase-client',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'
const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
const ASAAS_TIMEOUT = 10000

serve(async (req) => {
  console.log('🚀 Function started')
  console.log('Method:', req.method)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))

  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    if (!ASAAS_API_KEY) {
      throw new Error('API configuration error: Missing ASAAS_API_KEY')
    }

    const rawBody = await req.text();
    console.log('📦 Raw request body:', rawBody);

    if (!rawBody) {
      throw new Error('Request body is empty');
    }

    let requestBody;
    try {
      requestBody = JSON.parse(rawBody);
      console.log('📦 Parsed request body:', requestBody);
    } catch (error) {
      console.error('❌ Failed to parse request body:', error);
      throw new Error('Invalid JSON in request body');
    }

    const { userId, amount } = requestBody;
    console.log('💰 Amount:', amount);
    console.log('👤 User ID:', userId);

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount provided');
    }

    if (!userId) {
      throw new Error('userId is required');
    }

    // First, try to find existing customer
    console.log('🔍 Looking up customer for user:', userId);
    const searchResponse = await fetch(`${ASAAS_API_URL}/customers?email=user-${userId}@example.com`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      }
    });

    const searchResult = await searchResponse.json();
    console.log('🔍 Customer search result:', searchResult);

    let customerId;

    if (searchResult.data && searchResult.data.length > 0) {
      // Use existing customer
      customerId = searchResult.data[0].id;
      console.log('✅ Found existing customer:', customerId);
    } else {
      // Create new customer
      const customerPayload = {
        name: `User ${userId}`,
        cpfCnpj: "12345678909",
        email: `user-${userId}@example.com`,
      };

      console.log('📤 Creating new customer with payload:', customerPayload);
      
      const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify(customerPayload)
      });

      const customerData = await customerResponse.json();
      console.log('📥 Customer creation response:', customerData);

      if (!customerResponse.ok || !customerData.id) {
        console.error('❌ Failed to create customer:', customerData);
        throw new Error(`Failed to create customer: ${JSON.stringify(customerData)}`);
      }

      customerId = customerData.id;
      console.log('✅ Created new customer:', customerId);
    }

    // Then create payment
    console.log('💳 Creating payment for customer:', customerId);
    const paymentPayload = {
      customer: customerId,
      billingType: 'PIX',
      value: amount,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Recarga no sistema - User ID: ${userId}`,
      externalReference: userId
    };

    console.log('📤 Payment request payload:', paymentPayload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ASAAS_TIMEOUT);

    try {
      const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify(paymentPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const paymentData = await paymentResponse.json();
      console.log('📥 Payment creation response:', paymentData);

      if (!paymentResponse.ok || !paymentData.invoiceUrl) {
        console.error('❌ Failed to create payment:', paymentData);
        throw new Error(`Failed to create payment: ${JSON.stringify(paymentData)}`);
      }

      return new Response(
        JSON.stringify({ paymentUrl: paymentData.invoiceUrl }),
        {
          status: 200,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Payment creation timeout - request took too long');
      }
      throw error;
    }

  } catch (error) {
    console.error('❌ Function error:', error);
    console.error('Error stack:', error.stack);
    
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
    );
  }
})