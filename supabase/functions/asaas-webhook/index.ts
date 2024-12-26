import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "./utils/cors.ts"
import { AsaasWebhookEvent } from "./utils/types.ts"
import { checkPaymentProcessed, processPayment } from "./utils/payment-processor.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = new URLSearchParams(await req.text());
    const dataEncoded = formData.get('data');
    
    if (!dataEncoded) {
      console.error('No data field in webhook payload');
      return new Response(
        JSON.stringify({ error: 'No data field' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    const dataDecoded = decodeURIComponent(dataEncoded);
    const event = JSON.parse(dataDecoded) as AsaasWebhookEvent;

    if (event.event !== 'PAYMENT_RECEIVED' || !event.payment) {
      return new Response(
        JSON.stringify({ received: true }),
        { headers: corsHeaders }
      );
    }

    console.log('🎯 Processing webhook event:', {
      event_type: event.event,
      payment_status: event.payment.status,
      payment_value: event.payment.value,
      external_reference: event.payment.externalReference
    });

    console.log('👤 Processing payment for user:', event.payment.externalReference);
    console.log('💵 Payment amount:', event.payment.value);

    // Check if payment was already processed
    const isProcessed = await checkPaymentProcessed(event.payment.id);
    if (isProcessed) {
      console.log('⚠️ Payment already processed, skipping');
      return new Response(
        JSON.stringify({ received: true, status: 'already_processed' }),
        { headers: corsHeaders }
      );
    }

    // Process the payment
    const success = await processPayment(event.payment);
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Error processing payment' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: corsHeaders, status: 500 }
    );
  }
})