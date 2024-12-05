import { Database } from "./types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Bet = Database['public']['Tables']['bets']['Row'];