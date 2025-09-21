export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string
          category: string
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          image_url: string | null
          instructor: string | null
          start_time: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activity_type: string
          category: string
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          start_time?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activity_type?: string
          category?: string
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          start_time?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_super_admin: boolean
        }
        Insert: {
          created_at?: string
          id: string
          is_super_admin?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          is_super_admin?: boolean
        }
        Relationships: []
      }
      astrologers: {
        Row: {
          created_at: string
          experience_years: number | null
          id: string
          is_available: boolean | null
          rate_per_minute: number | null
          rating: number | null
          specialization: string[] | null
          total_consultations: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_years?: number | null
          id?: string
          is_available?: boolean | null
          rate_per_minute?: number | null
          rating?: number | null
          specialization?: string[] | null
          total_consultations?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          experience_years?: number | null
          id?: string
          is_available?: boolean | null
          rate_per_minute?: number | null
          rating?: number | null
          specialization?: string[] | null
          total_consultations?: number | null
          user_id?: string
        }
        Relationships: []
      }
      astrology_chats: {
        Row: {
          consultation_id: string
          created_at: string
          id: string
          message: string
          message_type: string | null
          sender_id: string
        }
        Insert: {
          consultation_id: string
          created_at?: string
          id?: string
          message: string
          message_type?: string | null
          sender_id: string
        }
        Update: {
          consultation_id?: string
          created_at?: string
          id?: string
          message?: string
          message_type?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_chats_consultation"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "astrology_consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      astrology_consultations: {
        Row: {
          astrologer_id: string
          consultation_type: string | null
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          payment_status: string | null
          started_at: string | null
          status: string | null
          total_cost: number | null
          user_id: string
        }
        Insert: {
          astrologer_id: string
          consultation_type?: string | null
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          payment_status?: string | null
          started_at?: string | null
          status?: string | null
          total_cost?: number | null
          user_id: string
        }
        Update: {
          astrologer_id?: string
          consultation_type?: string | null
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          payment_status?: string | null
          started_at?: string | null
          status?: string | null
          total_cost?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_consultations_astrologer"
            columns: ["astrologer_id"]
            isOneToOne: false
            referencedRelation: "astrologers"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          product_id: number
          product_name: string
          product_price: number
          quantity: number
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          product_id: number
          product_name: string
          product_price: number
          quantity?: number
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          product_id?: number
          product_name?: string
          product_price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          message_type: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      digital_literacy_courses: {
        Row: {
          content_url: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          instructor: string | null
          is_published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content_url?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          instructor?: string | null
          is_published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content_url?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          instructor?: string | null
          is_published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      employment_opportunities: {
        Row: {
          company_name: string | null
          contact_info: Json | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          job_type: string | null
          location: string | null
          posted_by: string | null
          requirements: string[] | null
          salary_range: string | null
          title: string
        }
        Insert: {
          company_name?: string | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          title: string
        }
        Update: {
          company_name?: string | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          title?: string
        }
        Relationships: []
      }
      friend_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          description: string | null
          game_type: string | null
          id: string
          is_active: boolean | null
          max_players: number | null
          min_age: number | null
          name: string
          rules: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          game_type?: string | null
          id?: string
          is_active?: boolean | null
          max_players?: number | null
          min_age?: number | null
          name: string
          rules?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          game_type?: string | null
          id?: string
          is_active?: boolean | null
          max_players?: number | null
          min_age?: number | null
          name?: string
          rules?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: number
          product_name: string
          product_price: number
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: number
          product_name: string
          product_price: number
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: number
          product_name?: string
          product_price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          payment_intent_id: string | null
          shipping_address: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_intent_id?: string | null
          shipping_address?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_intent_id?: string | null
          shipping_address?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: number
          rating: number | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: number
          rating?: number | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: number
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reviews_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          last_login_at: string | null
          phone_number: string | null
          photo_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          last_login_at?: string | null
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          last_login_at?: string | null
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          activity_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_packages: {
        Row: {
          available_slots: number | null
          created_at: string
          description: string | null
          destination: string
          duration_days: number | null
          end_date: string | null
          id: string
          images: string[] | null
          included_services: string[] | null
          is_active: boolean | null
          max_participants: number | null
          price: number | null
          start_date: string | null
          title: string
        }
        Insert: {
          available_slots?: number | null
          created_at?: string
          description?: string | null
          destination: string
          duration_days?: number | null
          end_date?: string | null
          id?: string
          images?: string[] | null
          included_services?: string[] | null
          is_active?: boolean | null
          max_participants?: number | null
          price?: number | null
          start_date?: string | null
          title: string
        }
        Update: {
          available_slots?: number | null
          created_at?: string
          description?: string | null
          destination?: string
          duration_days?: number | null
          end_date?: string | null
          id?: string
          images?: string[] | null
          included_services?: string[] | null
          is_active?: boolean | null
          max_participants?: number | null
          price?: number | null
          start_date?: string | null
          title?: string
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          connected_at: string
          id: string
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          connected_at?: string
          id?: string
          user_id_1: string
          user_id_2: string
        }
        Update: {
          connected_at?: string
          id?: string
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          astrology_preferences: Json | null
          created_at: string
          email_notifications: boolean | null
          id: string
          interests: string[] | null
          language: string | null
          notifications_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          astrology_preferences?: Json | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          interests?: string[] | null
          language?: string | null
          notifications_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          astrology_preferences?: Json | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          interests?: string[] | null
          language?: string | null
          notifications_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
