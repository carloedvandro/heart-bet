export interface AsaasPayment {
  id: string;
  value: number;
  status: string;
  externalReference: string;
  paymentDate: string;
}

export interface AsaasWebhookEvent {
  event: string;
  payment: AsaasPayment;
}