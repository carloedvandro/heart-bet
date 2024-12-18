import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { amount } = await req.json()

    if (!amount || isNaN(amount)) {
      return new Response(
        JSON.stringify({ error: 'Amount is required and must be a number' }),
        { headers: corsHeaders, status: 400 }
      )
    }

    console.log('Starting browser process with amount:', amount)
    
    const browser = await puppeteer.launch({ 
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
    });
    
    try {
      const page = await browser.newPage();
      
      // Login
      console.log('Navigating to login page...')
      await page.goto('https://app.sistemabarao.com.br/login', {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      const username = Deno.env.get('SISTEMA_BARAO_USER')
      const password = Deno.env.get('SISTEMA_BARAO_PASS')

      if (!username || !password) {
        throw new Error('Missing credentials')
      }

      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', password);
      
      console.log('Submitting login form...')
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('button[type="submit"]')
      ]);

      // Navigate to PIX page
      console.log('Navigating to PIX page...')
      await page.goto('https://app.sistemabarao.com.br/ellite-apostas/recarga-pix', {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // Fill amount and generate PIX
      console.log('Generating PIX for amount:', amount)
      await page.type('#amount', amount.toString());
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('#generate-pix-button')
      ]);

      // Get QR code and PIX code
      console.log('Extracting QR code and PIX code...')
      const qrCodeBase64 = await page.$eval('#qr-code-img', (img) => img.src.split(',')[1]);
      const pixCode = await page.$eval('#pix-code', (input) => input.value);

      console.log('Successfully generated PIX')
      await browser.close();

      return new Response(
        JSON.stringify({
          success: true,
          qrCode: qrCodeBase64,
          pixCode: pixCode,
        }),
        { headers: corsHeaders }
      )
    } catch (error) {
      console.error('Error during web automation:', error)
      await browser.close()
      throw error
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        headers: corsHeaders,
        status: 500 
      }
    )
  }
})