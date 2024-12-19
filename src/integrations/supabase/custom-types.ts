import { Database } from './types';

export type Profile = Database['public']['profiles']['Row'];
export type Bet = Database['public']['bets']['Row'];
export type Recharge = Database['public']['recharges']['Row'];
export type Draw = Database['public']['draws']['Row'];
export type BinancePayment = Database['public']['binance_payments']['Row'];
export type BinanceSettings = Database['public']['binance_settings']['Row'];