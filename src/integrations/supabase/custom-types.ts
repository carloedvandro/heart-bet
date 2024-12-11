import { BetType, DrawPeriod } from "@/types/betting";

export interface Profile {
  id: string;
  email: string | null;
  created_at: string;
  balance: number;
  is_admin: boolean | null;
}

export interface Bet {
  id: string;
  user_id: string;
  hearts: string[];
  created_at: string;
  result?: string | null;
  is_winner?: boolean | null;
  bet_type: BetType;
  amount: number;
  draw_period: DrawPeriod;
  draw_date: string;
  numbers: string[];
  drawn_numbers?: number[] | null; // Changed from string[] to number[] to match Supabase schema
  prize_amount?: number | null;
  position: number;
  bet_number?: string | null;
  profiles?: Profile;
}

export interface Recharge {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface Draw {
  id: string;
  draw_date: string;
  draw_period: DrawPeriod;
  drawn_numbers: string[];
  created_at: string;
}
