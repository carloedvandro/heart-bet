import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { FirecrawlApp } from 'https://esm.sh/@mendable/firecrawl-js@1.9.4'

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
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY')

    if (!username || !password || !firecrawlApiKey) {
      console.error('Missing required environment variables')
      return new Response(
        JSON.stringify({ error: 'Configuration error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('Starting Firecrawl process with amount:', amount)
    const firecrawl = new FirecrawlApp({ apiKey: firecrawlApiKey })

    const result = await firecrawl.crawlUrl('https://app.sistemabarao.com.br/ellite-apostas/recarga-pix', {
      authenticate: {
        type: 'form',
        loginUrl: 'https://app.sistemabarao.com.br/login',
        usernameField: 'username',
        passwordField: 'password',
        credentials: {
          username,
          password,
        },
      },
      actions: [
        {
          type: 'input',
          selector: '#amount',
          value: amount.toString(),
        },
        {
          type: 'click',
          selector: '#generate-pix-button',
          waitForNavigation: true,
        },
        {
          type: 'screenshot',
          selector: '#qr-code-container',
          output: 'base64',
        },
        {
          type: 'extract',
          selector: '#pix-code',
          attribute: 'value',
        },
      ],
    })

    if (!result.success) {
      console.error('Crawling failed:', result.error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate PIX' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        qrCode: result.screenshots[0],
        pixCode: result.data.pixCode,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
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