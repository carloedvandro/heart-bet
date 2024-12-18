import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import FirecrawlApp from 'npm:@mendable/firecrawl-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting dollar value scraping...')
    
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not found in environment variables')
      throw new Error('API key not configured')
    }
    
    const firecrawl = new FirecrawlApp({ apiKey })
    console.log('Initialized Firecrawl with API key')
    
    const result = await firecrawl.crawlUrl('https://www.google.com/search?q=valor+do+dolar&hl=pt-BR', {
      limit: 1,
      scrapeOptions: {
        selectors: ['.DFlfde.SwHCTb'], // Google's currency value selector
      }
    })

    console.log('Scraping result:', result)

    if (!result.success) {
      throw new Error('Failed to scrape dollar value')
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result.data
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})