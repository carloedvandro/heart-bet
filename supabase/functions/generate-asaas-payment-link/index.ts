import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer, x-supabase-client',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'
const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
const ASAAS_TIMEOUT = 30000 // 30 second timeout

serve(async (req) => {
  console.log('🚀 Function started')
  console.log('Method:', req.method)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    if (!ASAAS_API_KEY) {
      throw new Error('ASAAS_API_KEY not configured')
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
    
    if (!userId) {
      throw new Error('userId is required');
    }

    if (!amount || amount <= 0) {
      throw new Error('amount must be greater than 0');
    }

    console.log('💰 Processing payment request:', { userId, amount });

    // Get user's profile data for better customer creation
    const userResponse = await fetch(
      `${ASAAS_API_URL}/customers?email=user-${userId}@example.com`,
      {
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        }
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('❌ Customer lookup failed:', errorText);
      throw new Error(`Failed to lookup customer: ${errorText}`);
    }

    const userResult = await userResponse.json();
    console.log('🔍 Customer lookup result:', userResult);

    let customerId;

    if (userResult.data && userResult.data.length > 0) {
      customerId = userResult.data[0].id;
      console.log('✅ Using existing customer:', customerId);
    } else {
      // Create new customer with valid CPF
      const customerPayload = {
        name: `User ${userId}`,
        cpfCnpj: "00000000000", // Using a valid CPF format
        email: `user-${userId}@example.com`,
      };

      console.log('📤 Creating customer:', customerPayload);
      
      const customerResponse = await fetch(
        `${ASAAS_API_URL}/customers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'access_token': ASAAS_API_KEY,
          },
          body: JSON.stringify(customerPayload)
        }
      );

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error('❌ Customer creation failed:', errorText);
        throw new Error(`Failed to create customer: ${errorText}`);
      }

      const customerData = await customerResponse.json();
      console.log('📥 Customer created:', customerData);

      if (!customerData.id) {
        throw new Error('Invalid customer creation response - missing customer ID');
      }

      customerId = customerData.id;
    }

    // Create payment with proper validation
    const paymentPayload = {
      customer: customerId,
      billingType: 'PIX',
      value: amount,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Recarga no sistema - User ID: ${userId}`,
      externalReference: userId
    };

    console.log('📤 Creating payment:', paymentPayload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ASAAS_TIMEOUT);

    try {
      const paymentResponse = await fetch(
        `${ASAAS_API_URL}/payments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'access_token': ASAAS_API_KEY,
          },
          body: JSON.stringify(paymentPayload),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error('❌ Payment creation failed:', errorText);
        throw new Error(`Failed to create payment: ${errorText}`);
      }

      const paymentData = await paymentResponse.json();
      console.log('📥 Payment created:', paymentData);

      if (!paymentData.invoiceUrl) {
        throw new Error('Invalid payment response - missing invoice URL');
      }

      return new Response(
        JSON.stringify({ 
          paymentUrl: paymentData.invoiceUrl,
          success: true 
        }),
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
        throw new Error('Payment request timeout - please try again');
      }
      throw error;
    }

  } catch (error) {
    console.error('❌ Function error:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
        details: error.stack,
      }),
      {
        status: error.message.includes('not configured') ? 500 : 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
})