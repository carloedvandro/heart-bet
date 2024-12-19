export type PaymentTypes = {
  recharges: {
    Row: {
      id: string;
      user_id: string;
      amount: number;
      status: string;
      created_at: string;
    };
  };
  binance_payments: {
    Row: {
      id: string;
      user_id: string;
      amount: number;
      currency: string;
      status: string;
      binance_order_id?: string;
      binance_payment_id?: string;
      created_at: string;
      updated_at: string;
      completed_at?: string;
    };
    Insert: Omit<PaymentTypes['binance_payments']['Row'], 'id' | 'created_at' | 'updated_at'> & 
      Partial<Pick<PaymentTypes['binance_payments']['Row'], 'id' | 'created_at' | 'updated_at'>>;
    Update: Partial<PaymentTypes['binance_payments']['Row']>;
  };
  binance_settings: {
    Row: {
      id: string;
      api_key: string;
      api_secret: string;
      sub_account: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<PaymentTypes['binance_settings']['Row'], 'id' | 'created_at' | 'updated_at'> & 
      Partial<Pick<PaymentTypes['binance_settings']['Row'], 'id' | 'created_at' | 'updated_at'>>;
    Update: Partial<PaymentTypes['binance_settings']['Row']>;
  };
};