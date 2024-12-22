const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY');

if (!ASAAS_API_KEY) {
  throw new Error('ASAAS_API_KEY is not configured');
}

export async function lookupCustomer(email: string) {
  console.log('🔍 Looking up customer with email:', email);
  
  try {
    const response = await fetch(
      `${ASAAS_API_URL}/customers?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Customer lookup API error:', errorText);
      throw new Error(`Asaas API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Customer lookup response:', data);
    return data;
  } catch (error) {
    console.error('❌ Customer lookup error:', error);
    throw new Error(`Failed to lookup customer: ${error.message}`);
  }
}

export async function createCustomer(name: string, email: string) {
  console.log('📤 Creating customer:', { name, email });
  
  try {
    const customerPayload = {
      name,
      email,
      cpfCnpj: "00000000000" // Using a valid CPF format for testing
    };

    const response = await fetch(
      `${ASAAS_API_URL}/customers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY
        },
        body: JSON.stringify(customerPayload)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Customer creation failed:', errorText);
      throw new Error(`Asaas API error: ${errorText}`);
    }

    const data = await response.json();
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

    const response = await fetch(
      `${ASAAS_API_URL}/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY
        },
        body: JSON.stringify(paymentPayload)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Payment creation failed:', errorText);
      throw new Error(`Asaas API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Payment created:', data);
    return data;
  } catch (error) {
    console.error('❌ Payment creation error:', error);
    throw new Error(`Failed to create payment: ${error.message}`);
  }
}