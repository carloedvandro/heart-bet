import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
)

serve(async (req) => {
  console.log('📥 Checking Asaas payments status')

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Buscar pagamentos pendentes
    const { data: pendingPayments, error: fetchError } = await supabase
      .from('asaas_payments')
      .select('*')
      .eq('status', 'pending')

    if (fetchError) {
      console.error('❌ Error fetching pending payments:', fetchError)
      throw fetchError
    }

    console.log(`🔍 Found ${pendingPayments?.length || 0} pending payments`)

    const results = []
    
    // Verificar cada pagamento no Asaas
    for (const payment of pendingPayments || []) {
      try {
        console.log(`📋 Checking payment ${payment.asaas_id}`)
        
        const response = await fetch(
          `https://sandbox.asaas.com/api/v3/payments/${payment.asaas_id}`,
          {
            headers: {
              'access_token': ASAAS_API_KEY!
            }
          }
        )

        if (!response.ok) {
          console.error(`❌ Error fetching payment ${payment.asaas_id}:`, response.statusText)
          continue
        }

        const asaasPayment = await response.json()
        console.log(`💳 Payment ${payment.asaas_id} status:`, asaasPayment.status)

        // Se o pagamento foi confirmado
        if (asaasPayment.status === 'RECEIVED' && payment.status === 'pending') {
          console.log(`✅ Payment ${payment.asaas_id} confirmed, updating balance`)

          // Atualizar saldo usando RPC function
          const { data: newBalance, error: updateError } = await supabase
            .rpc('increment_balance', {
              amount: payment.amount
            })

          if (updateError) {
            console.error('❌ Error updating balance:', updateError)
            throw updateError
          }

          // Atualizar status do pagamento
          const { error: statusError } = await supabase
            .from('asaas_payments')
            .update({ 
              status: 'received',
              paid_at: new Date().toISOString()
            })
            .eq('asaas_id', payment.asaas_id)

          if (statusError) {
            console.error('❌ Error updating payment status:', statusError)
            throw statusError
          }

          results.push({
            asaas_id: payment.asaas_id,
            status: 'confirmed',
            new_balance: newBalance
          })
        }
      } catch (error) {
        console.error(`❌ Error processing payment ${payment.asaas_id}:`, error)
        results.push({
          asaas_id: payment.asaas_id,
          status: 'error',
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checked: pendingPayments?.length || 0,
        results 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})