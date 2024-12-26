export interface AsaasWebhookEvent {
  event: string;
  payment: AsaasPayment;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  value: number;
  netValue: number;
  status: string;
  externalReference: string;
  paymentDate?: string;
  confirmedDate?: string;
  description?: string;
}