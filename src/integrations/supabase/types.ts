export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bets: {
        Row: {
          id: string
          user_id: string
          hearts: string[]
          created_at: string
          result: string | null
          is_winner: boolean | null
          bet_type: 'simple_group' | 'dozen' | 'hundred' | 'thousand' | 'group_double' | 'group_triple'
          amount: number
          draw_period: 'morning' | 'afternoon' | 'evening' | 'night'
          draw_date: string
          numbers: string[]
          drawn_numbers: number[] | null
          prize_amount: number | null
          position: number
          bet_number: string | null
        }
        Insert: {
          id?: string
          user_id: string
          hearts: string[]
          created_at?: string
          result?: string | null
          is_winner?: boolean | null
          bet_type: 'simple_group' | 'dozen' | 'hundred' | 'thousand' | 'group_double' | 'group_triple'
          amount: number
          draw_period: 'morning' | 'afternoon' | 'evening' | 'night'
          draw_date?: string
          numbers: string[]
          drawn_numbers?: number[] | null
          prize_amount?: number | null
          position: number
          bet_number?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          hearts?: string[]
          created_at?: string
          result?: string | null
          is_winner?: boolean | null
          bet_type?: 'simple_group' | 'dozen' | 'hundred' | 'thousand' | 'group_double' | 'group_triple'
          amount?: number
          draw_period?: 'morning' | 'afternoon' | 'evening' | 'night'
          draw_date?: string
          numbers?: string[]
          drawn_numbers?: number[] | null
          prize_amount?: number | null
          position?: number
          bet_number?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          created_at: string
          balance: number
          is_admin: boolean | null
        }
        Insert: {
          id: string
          email?: string | null
          created_at?: string
          balance?: number
          is_admin?: boolean | null
        }
        Update: {
          id?: string
          email?: string | null
          created_at?: string
          balance?: number
          is_admin?: boolean | null
        }
      }
      recharges: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: string
          created_at?: string
        }
      }
      draws: {
        Row: {
          id: string
          draw_date: string
          draw_period: 'morning' | 'afternoon' | 'evening' | 'night'
          drawn_numbers: number[]
          created_at: string
        }
        Insert: {
          id?: string
          draw_date: string
          draw_period: 'morning' | 'afternoon' | 'evening' | 'night'
          drawn_numbers: number[]
          created_at?: string
        }
        Update: {
          id?: string
          draw_date?: string
          draw_period?: 'morning' | 'afternoon' | 'evening' | 'night'
          drawn_numbers?: number[]
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bet_type: 'simple_group' | 'dozen' | 'hundred' | 'thousand' | 'group_double' | 'group_triple'
      draw_period: 'morning' | 'afternoon' | 'evening' | 'night'
    }
  }
}