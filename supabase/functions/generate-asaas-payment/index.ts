import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

interface RequestBody {
  amount: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { amount } = await req.json() as RequestBody;

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    if (!ASAAS_API_KEY) {
      throw new Error("ASAAS_API_KEY not configured");
    }

    // Create payment in Asaas (using sandbox environment)
    const asaasResponse = await fetch("https://sandbox.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": ASAAS_API_KEY
      },
      body: JSON.stringify({
        customer: "cus_000005113863",
        billingType: "PIX",
        value: amount,
        dueDate: new Date().toISOString().split('T')[0]
      })
    });

    if (!asaasResponse.ok) {
      console.error("Asaas API error:", await asaasResponse.text());
      throw new Error("Failed to create payment");
    }

    const asaasData = await asaasResponse.json();

    // Get PIX QR Code
    const qrCodeResponse = await fetch(
      `https://sandbox.asaas.com/api/v3/payments/${asaasData.id}/pixQrCode`,
      {
        headers: {
          "Content-Type": "application/json",
          "access_token": ASAAS_API_KEY
        }
      }
    );

    if (!qrCodeResponse.ok) {
      console.error("Asaas QR Code error:", await qrCodeResponse.text());
      throw new Error("Failed to generate QR Code");
    }

    const qrCodeData = await qrCodeResponse.json();

    return new Response(
      JSON.stringify({
        payment: {
          id: asaasData.id,
          pixQrCode: qrCodeData.encodedImage,
          pixKey: qrCodeData.payload
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in generate-asaas-payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
})