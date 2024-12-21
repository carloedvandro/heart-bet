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
const GENERIC_CUSTOMER_ID = 'cus_000012345678'

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

    console.log('📡 Preparing Asaas API request...');
    const payload = {
      customer: GENERIC_CUSTOMER_ID,
      billingType: 'PIX',
      value: amount,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Recarga no sistema - User ID: ${userId}`,
      externalReference: userId
    };
    console.log('📤 Request payload to Asaas:', payload);

    let asaasResponse;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ASAAS_TIMEOUT);

      asaasResponse = await fetch(`${ASAAS_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      const responseText = await asaasResponse.text();
      console.log('📥 Raw Asaas response:', responseText);

      if (!asaasResponse.ok) {
        console.error('❌ Error response from Asaas:', {
          status: asaasResponse.status,
          statusText: asaasResponse.statusText,
          body: responseText
        });
        
        try {
          const errorJson = JSON.parse(responseText);
          throw new Error(`Asaas API error: ${errorJson.errors?.[0]?.description || 'Unknown error'}`);
        } catch (parseError) {
          throw new Error(`Asaas API error: ${responseText || `${asaasResponse.status} ${asaasResponse.statusText}`}`);
        }
      }

      const data = JSON.parse(responseText);
      console.log('✅ Parsed Asaas response:', data);

      if (!data.invoiceUrl) {
        throw new Error('Invalid payment response: missing invoiceUrl');
      }

      return new Response(
        JSON.stringify({ paymentUrl: data.invoiceUrl }),
        {
          status: 200,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );

    } catch (error) {
      console.error('❌ Error during Asaas API call:', error);
      if (error.name === 'AbortError') {
        throw new Error('Asaas API timeout - request took too long');
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