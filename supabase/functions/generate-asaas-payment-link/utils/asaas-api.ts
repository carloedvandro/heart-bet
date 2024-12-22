const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY');

export async function lookupCustomer(email: string) {
  console.log('🔍 Looking up customer with email:', email);
  
  const response = await fetch(
    `${ASAAS_API_URL}/customers?email=${encodeURIComponent(email)}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY || '',
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Customer lookup failed:', errorText);
    throw new Error('Failed to lookup customer: ' + errorText);
  }

  return await response.json();
}

export async function createCustomer(name: string, email: string) {
  console.log('📤 Creating customer:', { name, email });
  
  const customerPayload = {
    name,
    cpfCnpj: "12345678909", // Valid CPF format
    email,
  };

  const response = await fetch(
    `${ASAAS_API_URL}/customers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY || '',
      },
      body: JSON.stringify(customerPayload)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Customer creation failed:', errorText);
    throw new Error('Failed to create customer: ' + errorText);
  }

  return await response.json();
}

export async function createPayment(customerId: string, amount: number, userId: string) {
  console.log('📤 Creating payment:', { customerId, amount, userId });
  
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
        'access_token': ASAAS_API_KEY || '',
      },
      body: JSON.stringify(paymentPayload)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Payment creation failed:', errorText);
    throw new Error('Failed to create payment: ' + errorText);
  }

  return await response.json();
}