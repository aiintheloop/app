export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      approvals: {
        Row: {
          approved: boolean | null;
          content: string | null;
          created_at: string | null;
          ID: string;
          process_id: string | null;
          user_id: string | null;
        };
        Insert: {
          approved?: boolean | null;
          content?: string | null;
          created_at?: string | null;
          ID?: string;
          process_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          approved?: boolean | null;
          content?: string | null;
          created_at?: string | null;
          ID?: string;
          process_id?: string | null;
          user_id?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
        };
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database['public']['Enums']['pricing_type'] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
      };
      processes: {
        Row: {
          created_at: string | null;
          ident: string;
          name: string | null;
          description: string | null;
          user_id: string | null;
          webhook: string | null;
        };
        Insert: {
          created_at?: string | null;
          ident?: string;
          name?: string | null;
          description?: string | null;
          user_id?: string | null;
          webhook?: string | null;
        };
        Update: {
          created_at?: string | null;
          ident?: string;
          name?: string | null;
          description?: string | null;
          user_id?: string | null;
          webhook?: string | null;
        };
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          status: Database['public']['Enums']['subscription_status'] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
      };
      Test: {
        Row: {
          created_at: string | null;
          id: string;
        };
        Insert: {
          created_at?: string | null;
          id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
        };
      };
      users: {
        Row: {
          api_key: string | null;
          avatar_url: string | null;
          billing_address: Json | null;
          full_name: string | null;
          id: string;
          payment_method: Json | null;
          email: string | null;
        };
        Insert: {
          api_key?: string | null;
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id: string;
          payment_method?: Json | null;
          email?: string | null;
        };
        Update: {
          api_key?: string | null;
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id?: string;
          payment_method?: Json | null;
          email?: string | null;
        };
      };
      webhooks: {
        Row: {
          approval: string | null;
          created_at: string | null;
          id: string;
          status: string | null;
        };
        Insert: {
          approval?: string | null;
          created_at?: string | null;
          id: string;
          status?: string | null;
        };
        Update: {
          approval?: string | null;
          created_at?: string | null;
          id?: string;
          status?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_header: {
        Args: { item: string };
        Returns: string;
      };
      get_id_from_api_key: {
        Args: { item: string };
        Returns: string;
      };
      test: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      valid_api_key: {
        Args: { item: string };
        Returns: string;
      };
    };
    Enums: {
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year';
      pricing_type: 'one_time' | 'recurring';
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid';
    };
  };
}
