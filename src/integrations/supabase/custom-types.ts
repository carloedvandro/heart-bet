import { Database } from './types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Bet = Database['public']['Tables']['bets']['Row'];
export type Recharge = Database['public']['Tables']['recharges']['Row'];
export type Draw = Database['public']['Tables']['draws']['Row'];
export type BinancePayment = Database['public']['Tables']['binance_payments']['Row'];
export type BinanceSettings = Database['public']['Tables']['binance_settings']['Row'];