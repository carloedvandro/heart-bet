import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { processPayment } from "./utils/payment-processor.ts"
import { AsaasWebhookEvent } from "./utils/types.ts"

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

    // Process the payment
    const result = await processPayment(event.payment);
    
    return new Response(
      JSON.stringify(result),
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