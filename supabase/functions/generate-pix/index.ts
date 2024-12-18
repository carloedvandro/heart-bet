import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount } = await req.json()

    if (!amount || isNaN(amount)) {
      return new Response(
        JSON.stringify({ error: 'Amount is required and must be a number' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const username = Deno.env.get('SISTEMA_BARAO_USER')
    const password = Deno.env.get('SISTEMA_BARAO_PASS')

    if (!username || !password) {
      console.error('Missing required environment variables')
      return new Response(
        JSON.stringify({ error: 'Configuration error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('Starting browser process with amount:', amount)
    
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    try {
      // Login
      await page.goto('https://app.sistemabarao.com.br/login');
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', password);
      await Promise.all([
        page.waitForNavigation(),
        page.click('button[type="submit"]')
      ]);

      // Navigate to PIX page
      await page.goto('https://app.sistemabarao.com.br/ellite-apostas/recarga-pix');
      
      // Fill amount and generate PIX
      await page.type('#amount', amount.toString());
      await Promise.all([
        page.waitForNavigation(),
        page.click('#generate-pix-button')
      ]);

      // Get QR code and PIX code
      const qrCodeBase64 = await page.$eval('#qr-code-img', (img) => img.src.split(',')[1]);
      const pixCode = await page.$eval('#pix-code', (input) => input.value);

      await browser.close();

      return new Response(
        JSON.stringify({
          success: true,
          qrCode: qrCodeBase64,
          pixCode: pixCode,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
      console.error('Error during web automation:', error)
      await browser.close()
      throw error
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})