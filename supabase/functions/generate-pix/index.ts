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

  let browser = null;
  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { amount } = await req.json()
    console.log('Processing PIX generation request for amount:', amount)

    if (!amount || isNaN(amount)) {
      return new Response(
        JSON.stringify({ error: 'Amount is required and must be a number' }),
        { headers: corsHeaders, status: 400 }
      )
    }

    const username = Deno.env.get('SISTEMA_BARAO_USER')
    const password = Deno.env.get('SISTEMA_BARAO_PASS')

    if (!username || !password) {
      throw new Error('Missing credentials')
    }

    console.log('Launching browser...')
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
      ],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setViewport({ width: 1280, height: 800 });

    // Primeiro, navegar para a página principal
    console.log('Navigating to main page...')
    await page.goto('https://app.sistemabarao.com.br/', {
      waitUntil: 'networkidle0',
    });

    // Aguardar 5 segundos
    console.log('Waiting 5 seconds before proceeding...')
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Agora navegar para a página de login
    console.log('Navigating to login page...')
    await page.goto('https://app.sistemabarao.com.br/login', {
      waitUntil: 'networkidle0',
    });

    console.log('Filling login form...')
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    
    console.log('Submitting login form...')
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);

    // Aguardar mais 5 segundos antes de navegar para a página do PIX
    console.log('Waiting 5 seconds before navigating to PIX page...')
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Navigating to PIX page...')
    await page.goto('https://app.sistemabarao.com.br/ellite-apostas/recarga-pix', {
      waitUntil: 'networkidle0',
    });
    
    console.log('Generating PIX for amount:', amount)
    await page.type('#amount', amount.toString());
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('#generate-pix-button')
    ]);

    console.log('Extracting QR code and PIX code...')
    const qrCodeBase64 = await page.$eval('#qr-code-img', (img) => img.src.split(',')[1]);
    const pixCode = await page.$eval('#pix-code', (input) => input.value);

    await browser.close();
    browser = null;

    console.log('Successfully generated PIX')
    return new Response(
      JSON.stringify({
        success: true,
        qrCode: qrCodeBase64,
        pixCode: pixCode,
      }),
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error:', error)
    
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack
      }),
      { 
        headers: corsHeaders,
        status: 500 
      }
    )
  }
})