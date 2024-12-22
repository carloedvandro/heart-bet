export interface PaymentRequest {
  userId: string;
  amount: number;
}

export function validateRequest(body: unknown): PaymentRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const { userId, amount } = body as Record<string, unknown>;

  if (!userId || typeof userId !== 'string') {
    throw new Error('userId is required and must be a string');
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw new Error('amount must be a positive number');
  }

  return { userId, amount };
}