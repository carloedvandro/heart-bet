import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createCustomer, createPayment, lookupCustomer } from "./utils/asaas-api.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('🚀 Function started');
  
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

    // Get user email from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const email = tokenData.email || `user-${userId}@example.com`;

    console.log('🔍 Looking up customer with email:', email);
    let customerResult = await lookupCustomer(email);
    let customerId;

    if (customerResult.data && customerResult.data.length > 0) {
      customerId = customerResult.data[0].id;
      console.log('✅ Using existing customer:', customerId);
    } else {
      console.log('📝 Creating new customer');
      const customerData = await createCustomer(email.split('@')[0], email);
      console.log('📥 Customer created:', customerData);

      if (!customerData.id) {
        throw new Error('Invalid customer creation response - missing customer ID');
      }

      customerId = customerData.id;
    }

    console.log('💳 Creating payment for customer:', customerId);
    const paymentData = await createPayment(customerId, amount, userId);
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
    console.error('❌ Function error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
        details: error.stack,
      }),
      {
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});