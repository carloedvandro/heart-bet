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
      active_bets_formatted: {
        Row: {
          bet_id: string
          bet_type: Database["public"]["Enums"]["bet_type"]
          created_at: string
          draw_date: string
          draw_period: Database["public"]["Enums"]["draw_period"]
          formatted_numbers: string
          id: string
          position: number
        }
        Insert: {
          bet_id: string
          bet_type: Database["public"]["Enums"]["bet_type"]
          created_at?: string
          draw_date: string
          draw_period: Database["public"]["Enums"]["draw_period"]
          formatted_numbers: string
          id?: string
          position: number
        }
        Update: {
          bet_id?: string
          bet_type?: Database["public"]["Enums"]["bet_type"]
          created_at?: string
          draw_date?: string
          draw_period?: Database["public"]["Enums"]["draw_period"]
          formatted_numbers?: string
          id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "active_bets_formatted_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
        ]
      }
      asaas_payments: {
        Row: {
          amount: number
          asaas_id: string
          created_at: string
          expires_at: string | null
          id: string
          paid_at: string | null
          qr_code: string | null
          qr_code_text: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          asaas_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          paid_at?: string | null
          qr_code?: string | null
          qr_code_text?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          asaas_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          paid_at?: string | null
          qr_code?: string | null
          qr_code_text?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      balance_history: {
        Row: {
          admin_id: string
          amount: number
          created_at: string
          id: string
          new_balance: number
          operation_type: Database["public"]["Enums"]["balance_operation_type"]
          previous_balance: number
          user_id: string
        }
        Insert: {
          admin_id: string
          amount: number
          created_at?: string
          id?: string
          new_balance: number
          operation_type?: Database["public"]["Enums"]["balance_operation_type"]
          previous_balance: number
          user_id: string
        }
        Update: {
          admin_id?: string
          amount?: number
          created_at?: string
          id?: string
          new_balance?: number
          operation_type?: Database["public"]["Enums"]["balance_operation_type"]
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
          amount: number
          binance_order_id: string | null
          binance_payment_id: string | null
          completed_at: string | null
          created_at: string | null
          currency: string
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          binance_order_id?: string | null
          binance_payment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          binance_order_id?: string | null
          binance_payment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      binance_settings: {
        Row: {
          api_key: string
          api_secret: string
          created_at: string | null
          id: string
          is_active: boolean | null
          sub_account: string
          updated_at: string | null
        }
        Insert: {
          api_key: string
          api_secret: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          sub_account: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string
          api_secret?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          sub_account?: string
          updated_at?: string | null
        }
        Relationships: []
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
      financial_profiles: {
        Row: {
          birth_date: string
          city: string
          cpf: string
          created_at: string
          full_name: string
          id: string
          neighborhood: string
          number: string
          phone: string
          pix_key: string
          pix_type: string
          state: string
          street: string
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          zip_code: string
        }
        Insert: {
          birth_date: string
          city: string
          cpf: string
          created_at?: string
          full_name: string
          id: string
          neighborhood: string
          number: string
          phone: string
          pix_key: string
          pix_type: string
          state: string
          street: string
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          zip_code: string
        }
        Update: {
          birth_date?: string
          city?: string
          cpf?: string
          created_at?: string
          full_name?: string
          id?: string
          neighborhood?: string
          number?: string
          phone?: string
          pix_key?: string
          pix_type?: string
          state?: string
          street?: string
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      lottery_results: {
        Row: {
          animal: string | null
          created_at: string
          created_by: string
          draw_date: string
          draw_period: Database["public"]["Enums"]["draw_period"] | null
          game_number: string | null
          id: string
          number: string | null
          position: number | null
        }
        Insert: {
          animal?: string | null
          created_at?: string
          created_by: string
          draw_date: string
          draw_period?: Database["public"]["Enums"]["draw_period"] | null
          game_number?: string | null
          id?: string
          number?: string | null
          position?: number | null
        }
        Update: {
          animal?: string | null
          created_at?: string
          created_by?: string
          draw_date?: string
          draw_period?: Database["public"]["Enums"]["draw_period"] | null
          game_number?: string | null
          id?: string
          number?: string | null
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lottery_results_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_id: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
          proof_status: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          proof_status?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          proof_status?: string | null
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
      trade_earnings: {
        Row: {
          amount: number
          created_at: string
          earned_at: string
          id: string
          investment_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          earned_at?: string
          id?: string
          investment_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          earned_at?: string
          id?: string
          investment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_earnings_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "trade_investments"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_investments: {
        Row: {
          amount: number
          created_at: string
          current_balance: number
          daily_rate: number
          id: string
          lock_period: number
          locked_until: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          current_balance: number
          daily_rate: number
          id?: string
          lock_period: number
          locked_until: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          current_balance?: number
          daily_rate?: number
          id?: string
          lock_period?: number
          locked_until?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_operations: {
        Row: {
          created_at: string
          id: string
          investment_id: string
          next_operation_at: string
          operated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          investment_id: string
          next_operation_at: string
          operated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          investment_id?: string
          next_operation_at?: string
          operated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_investment"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "trade_investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_operations_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "trade_investments"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_withdrawals: {
        Row: {
          amount: number
          fee_amount: number
          id: string
          investment_id: string
          net_amount: number
          processed_at: string | null
          requested_at: string
          status: string
        }
        Insert: {
          amount: number
          fee_amount: number
          id?: string
          investment_id: string
          net_amount: number
          processed_at?: string | null
          requested_at?: string
          status?: string
        }
        Update: {
          amount?: number
          fee_amount?: number
          id?: string
          investment_id?: string
          net_amount?: number
          processed_at?: string | null
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_withdrawals_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "trade_investments"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          amount: number
          created_at: string | null
          fee_amount: number
          id: string
          net_amount: number
          processed_at: string | null
          requested_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          fee_amount: number
          id?: string
          net_amount: number
          processed_at?: string | null
          requested_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          fee_amount?: number
          id?: string
          net_amount?: number
          processed_at?: string | null
          requested_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
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
      clean_old_draws: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      clean_user_investments: {
        Args: {
          user_email: string
        }
        Returns: undefined
      }
      delete_trade_investment: {
        Args: {
          p_investment_id: string
        }
        Returns: undefined
      }
      format_bet_numbers: {
        Args: {
          numbers: string[]
          bet_type: Database["public"]["Enums"]["bet_type"]
        }
        Returns: string
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
      populate_active_bets_formatted: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      release_investment_funds: {
        Args: {
          p_investment_id: string
          p_amount: number
        }
        Returns: undefined
      }
      update_investment_lock_period: {
        Args: {
          p_investment_id: string
          p_new_lock_period: number
          p_new_daily_rate: number
        }
        Returns: undefined
      }
    }
    Enums: {
      balance_operation_type:
        | "credit"
        | "debit"
        | "recharge"
        | "bet"
        | "bet_win"
        | "bet_refund"
        | "trade_investment"
        | "trade_earning"
        | "trade_withdrawal"
        | "trade_refund"
        | "manual_credit"
        | "manual_debit"
        | "asaas_payment"
        | "investment_withdrawal"
        | "investment_deletion"
        | "investment_release"
        | "investment_cancellation"
      bet_type:
        | "simple_group"
        | "dozen"
        | "hundred"
        | "thousand"
        | "group_double"
        | "group_triple"
      draw_period: "morning" | "afternoon" | "evening" | "night"
      payment_status:
        | "pending"
        | "received"
        | "confirmed"
        | "overdue"
        | "refunded"
        | "cancelled"
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
