const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY');

if (!ASAAS_API_KEY) {
  throw new Error('ASAAS_API_KEY is not configured');
}

async function makeAsaasRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${ASAAS_API_URL}${endpoint}`;
  console.log(`🔄 Making Asaas API request to: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
        ...options.headers,
      },
    });

    const responseText = await response.text();
    console.log(`📥 Asaas API response: ${responseText}`);

    if (!response.ok) {
      throw new Error(`Asaas API error (${response.status}): ${responseText}`);
    }

    try {
      return responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.error('❌ Failed to parse JSON response:', e);
      throw new Error(`Invalid JSON response from Asaas API: ${responseText}`);
    }
  } catch (error) {
    console.error(`❌ Request failed for ${url}:`, error);
    throw error;
  }
}

export async function lookupCustomer(email: string) {
  console.log('🔍 Looking up customer with email:', email);
  
  try {
    const data = await makeAsaasRequest(
      `/customers?email=${encodeURIComponent(email)}`
    );
    
    console.log('✅ Customer lookup response:', data);
    return data;
  } catch (error) {
    console.error('❌ Customer lookup error:', error);
    throw new Error(`Failed to lookup customer: ${error.message}`);
  }
}

export async function createCustomer(name: string, email: string, cpf: string) {
  console.log('📤 Creating customer:', { name, email, cpf });
  
  try {
    const customerPayload = {
      name,
      email,
      cpfCnpj: cpf || undefined // Only send if CPF exists
    };

    const data = await makeAsaasRequest(
      '/customers',
      {
        method: 'POST',
        body: JSON.stringify(customerPayload),
      }
    );

    console.log('✅ Customer created:', data);
    return data;
  } catch (error) {
    console.error('❌ Customer creation error:', error);
    throw new Error(`Failed to create customer: ${error.message}`);
  }
}

export async function createPayment(customerId: string, amount: number, userId: string) {
  console.log('📤 Creating payment:', { customerId, amount, userId });
  
  try {
    const paymentPayload = {
      customer: customerId,
      billingType: 'PIX',
      value: amount,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Recarga no sistema - User ID: ${userId}`,
      externalReference: userId
    };

    const data = await makeAsaasRequest(
      '/payments',
      {
        method: 'POST',
        body: JSON.stringify(paymentPayload),
      }
    );

    console.log('✅ Payment created:', data);
    return data;
  } catch (error) {
    console.error('❌ Payment creation error:', error);
    throw new Error(`Failed to create payment: ${error.message}`);
  }
}