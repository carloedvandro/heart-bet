import { BetType, DrawPeriod } from "@/types/betting";

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
  drawn_numbers?: string[] | null;
  prize_amount?: number | null;
  position: number;
  bet_number?: string | null;
}