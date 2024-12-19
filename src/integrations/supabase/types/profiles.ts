export type ProfileTypes = {
  profiles: {
    Row: {
      id: string;
      email: string | null;
      created_at: string;
      balance: number;
      is_admin: boolean | null;
    };
    Insert: {
      id: string;
      email?: string | null;
      created_at?: string;
      balance?: number;
      is_admin?: boolean | null;
    };
    Update: {
      id?: string;
      email?: string | null;
      created_at?: string;
      balance?: number;
      is_admin?: boolean | null;
    };
  };
};