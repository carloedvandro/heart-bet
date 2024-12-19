export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      balance_history: {
        Row: {
          admin_id: string
          amount: number
          created_at: string
          id: string
          new_balance: number
          operation_type: string
          previous_balance: number
          user_id: string
        }
        Insert: {
          admin_id: string
          amount: number
          created_at?: string
          id?: string
          new_balance: number
          operation_type: string
          previous_balance: number
          user_id: string
        }
        Update: {
          admin_id?: string
          amount?: number
          created_at?: string
          id?: string
          new_balance?: number
          operation_type?: string
          previous_balance?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "balance_history_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balance_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bet_type_settings: {
        Row: {
          bet_type: Database["public"]["Enums"]["bet_type"]
          id: string
          is_active: boolean
          updated_at: string | null
        }
        Insert: {
          bet_type: Database["public"]["Enums"]["bet_type"]
          id?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Update: {
          bet_type?: Database["public"]["Enums"]["bet_type"]
          id?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      bets: {
        Row: {
          amount: number
          bet_number: string | null
          bet_type: Database["public"]["Enums"]["bet_type"]
          created_at: string
          draw_date: string
          draw_period: Database["public"]["Enums"]["draw_period"]
          drawn_numbers: number[] | null
          id: string
          is_winner: boolean | null
          numbers: string[]
          position: number
          prize_amount: number | null
          result: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          bet_number?: string | null
          bet_type: Database["public"]["Enums"]["bet_type"]
          created_at?: string
          draw_date?: string
          draw_period: Database["public"]["Enums"]["draw_period"]
          drawn_numbers?: number[] | null
          id?: string
          is_winner?: boolean | null
          numbers: string[]
          position?: number
          prize_amount?: number | null
          result?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bet_number?: string | null
          bet_type?: Database["public"]["Enums"]["bet_type"]
          created_at?: string
          draw_date?: string
          draw_period?: Database["public"]["Enums"]["draw_period"]
          drawn_numbers?: number[] | null
          id?: string
          is_winner?: boolean | null
          numbers?: string[]
          position?: number
          prize_amount?: number | null
          result?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      binance_payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed';
          binance_order_id?: string;
          binance_payment_id?: string;
          created_at: string;
          updated_at: string;
          completed_at?: string;
        };
        Insert: Omit<BinancePayment, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<BinancePayment, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<BinancePayment>;
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
        Insert: Omit<BinanceSettings, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<BinanceSettings, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<BinanceSettings>;
      };
    };
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_daily_earnings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cancel_investment: {
        Args: {
          investment_id: string
        }
        Returns: undefined
      }
      clean_user_investments: {
        Args: {
          user_email: string
        }
        Returns: undefined
      }
      get_all_bets_today: {
        Args: {
          today_date: string
        }
        Returns: {
          id: string
          user_id: string
          amount: number
          created_at: string
        }[]
      }
      get_next_operation_time: {
        Args: {
          p_investment_id: string
        }
        Returns: string
      }
      heart_to_number: {
        Args: {
          heart_color: string
        }
        Returns: number
      }
      increment_balance: {
        Args: {
          amount: number
        }
        Returns: number
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      bet_type:
        | "simple_group"
        | "dozen"
        | "hundred"
        | "thousand"
        | "group_double"
        | "group_triple"
      draw_period: "morning" | "afternoon" | "evening" | "night"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
