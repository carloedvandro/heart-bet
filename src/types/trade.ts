export interface Investment {
  id: string;
  created_at: string;
  amount: number;
  daily_rate: number;
  locked_until: string;
  current_balance: number;
  status: string;
}