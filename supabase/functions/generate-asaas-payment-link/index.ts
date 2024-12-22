import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "./utils/cors.ts"
import { lookupCustomer, createCustomer, createPayment } from "./utils/asaas-api.ts"

const TIMEOUT = 30000; // 30 second timeout

serve(async (req) => {
  console.log('🚀 Function started');
  console.log('Method:', req.method);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
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
    if (!userId || !amount) {
      throw new Error('Missing required fields: userId and amount are required');
    }

    console.log('💰 Processing payment request:', { userId, amount });

    const email = `user-${userId}@example.com`;
    const userResult = await lookupCustomer(email);
    console.log('🔍 Customer lookup result:', userResult);

    let customerId;

    if (userResult.data && userResult.data.length > 0) {
      customerId = userResult.data[0].id;
      console.log('✅ Using existing customer:', customerId);
    } else {
      const customerData = await createCustomer(`User ${userId}`, email);
      console.log('📥 Customer created:', customerData);

      if (!customerData.id) {
        throw new Error('Invalid customer creation response - missing customer ID');
      }

      customerId = customerData.id;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const paymentData = await createPayment(customerId, amount, userId);
      clearTimeout(timeoutId);

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
});