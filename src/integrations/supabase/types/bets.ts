export type BetTypes = {
  bets: {
    Row: {
      id: string;
      user_id: string;
      created_at: string;
      result: string | null;
      is_winner: boolean | null;
      bet_type: string;
      amount: number;
      draw_period: string;
      draw_date: string;
      numbers: string[];
      drawn_numbers: number[] | null;
      prize_amount: number | null;
      position: number;
      bet_number: string | null;
    };
  };
  draws: {
    Row: {
      id: string;
      draw_date: string;
      draw_period: string;
      drawn_numbers: number[];
      created_at: string;
    };
  };
};