import { Database } from "./types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Bet = Database['public']['Tables']['bets']['Row'];
export type Recharge = Database['public']['Tables']['recharges']['Row'];
export type Draw = Database['public']['Tables']['draws']['Row'];