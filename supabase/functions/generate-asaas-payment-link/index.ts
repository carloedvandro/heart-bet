import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createCustomer, createPayment, lookupCustomer } from "./utils/asaas-api.ts"
import { supabase } from "./utils/supabaseClient.ts"

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

    // Get user's financial profile for CPF
    const { data: financialProfile, error: profileError } = await supabase
      .from('financial_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching financial profile:', profileError);
    }

    // Get user's email from profiles table
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      throw new Error('User not found');
    }

    const email = userProfile.email;
    const name = financialProfile?.full_name || email.split('@')[0];
    const cpf = financialProfile?.cpf;

    console.log('🔍 Looking up customer with email:', email);
    let customerResult = await lookupCustomer(email);
    let customerId;

    if (customerResult?.data && customerResult.data.length > 0) {
      customerId = customerResult.data[0].id;
      console.log('✅ Using existing customer:', customerId);
    } else {
      console.log('📝 Creating new customer');
      const customerData = await createCustomer(name, email, cpf);
      console.log('📥 Customer created:', customerData);

      if (!customerData?.id) {
        throw new Error('Invalid customer creation response - missing customer ID');
      }

      customerId = customerData.id;
    }

    console.log('💳 Creating payment for customer:', customerId);
    const paymentData = await createPayment(customerId, amount, userId);
    console.log('📥 Payment created:', paymentData);

    if (!paymentData?.invoiceUrl) {
      throw new Error('Invalid payment response - missing invoice URL');
    }

    // Save payment info in our database
    const { error: insertError } = await supabase
      .from('asaas_payments')
      .insert({
        user_id: userId,
        asaas_id: paymentData.id,
        amount: amount,
        status: 'pending',
        qr_code: paymentData.qrCode,
        qr_code_text: paymentData.encodedImage,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

    if (insertError) {
      console.error('Error saving payment:', insertError);
      // Don't throw here, we still want to return the payment URL
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