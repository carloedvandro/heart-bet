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
      draws: {
        Row: {
          created_at: string
          draw_date: string
          draw_period: Database["public"]["Enums"]["draw_period"]
          drawn_numbers: number[]
          id: string
        }
        Insert: {
          created_at?: string
          draw_date: string
          draw_period: Database["public"]["Enums"]["draw_period"]
          drawn_numbers: number[]
          id?: string
        }
        Update: {
          created_at?: string
          draw_date?: string
          draw_period?: Database["public"]["Enums"]["draw_period"]
          drawn_numbers?: number[]
          id?: string
        }
        Relationships: []
      }
      payment_proofs: {
        Row: {
          created_at: string
          file_path: string
          id: string
          recharge_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          recharge_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          recharge_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_recharge"
            columns: ["recharge_id"]
            isOneToOne: false
            referencedRelation: "recharges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_recharge_id_fkey"
            columns: ["recharge_id"]
            isOneToOne: false
            referencedRelation: "recharges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pix_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          status: string
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          status?: string
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          status?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
        }
        Insert: {
          balance?: number
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
        }
        Update: {
          balance?: number
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
        }
        Relationships: []
      }
      recharges: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recharges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      heart_to_number: {
        Args: {
          heart_color: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
