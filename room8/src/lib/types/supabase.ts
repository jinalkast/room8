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
      bill_presets: {
        Row: {
          amount: number
          created_at: string
          house_id: string
          id: string
          name: string
          owed_by: string | null
          owes: Json | null
        }
        Insert: {
          amount: number
          created_at?: string
          house_id: string
          id?: string
          name: string
          owed_by?: string | null
          owes?: Json | null
        }
        Update: {
          amount?: number
          created_at?: string
          house_id?: string
          id?: string
          name?: string
          owed_by?: string | null
          owes?: Json | null
        }
        Relationships: []
      }
      bills: {
        Row: {
          created_at: string
          id: string
          loaner_id: string
          name: string
          owed_by: string | null
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          loaner_id: string
          name?: string
          owed_by?: string | null
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          loaner_id?: string
          name?: string
          owed_by?: string | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_loaner_id_fkey"
            columns: ["loaner_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "bills_loaner_id_fkey"
            columns: ["loaner_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "bills_loaner_id_fkey"
            columns: ["loaner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chores: {
        Row: {
          created_at: string
          description: string | null
          house_id: string
          id: number
          time: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          house_id: string
          id?: number
          time: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          house_id?: string
          id?: number
          time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      chores_completed: {
        Row: {
          created_at: string
          id: number
          responsible_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          responsible_id: number
        }
        Update: {
          created_at?: string
          id?: number
          responsible_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "chores_completed_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "responsible"
            referencedColumns: ["id"]
          },
        ]
      }
      cleanliness_logs: {
        Row: {
          after_image_url: string
          before_image_url: string
          camera_id: string
          created_at: string
          id: string
        }
        Insert: {
          after_image_url: string
          before_image_url: string
          camera_id: string
          created_at?: string
          id?: string
        }
        Update: {
          after_image_url?: string
          before_image_url?: string
          camera_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleanliness_logs_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["camera_id"]
          },
        ]
      }
      cleanliness_tasks: {
        Row: {
          assigned_by_id: string | null
          assigned_to_id: string | null
          cl_log_id: string
          completed_by_id: string | null
          created_at: string
          id: number
          name: string
          status: string
        }
        Insert: {
          assigned_by_id?: string | null
          assigned_to_id?: string | null
          cl_log_id: string
          completed_by_id?: string | null
          created_at?: string
          id?: number
          name: string
          status?: string
        }
        Update: {
          assigned_by_id?: string | null
          assigned_to_id?: string | null
          cl_log_id?: string
          completed_by_id?: string | null
          created_at?: string
          id?: number
          name?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleanliness_tasks_assigned_by_id_fkey"
            columns: ["assigned_by_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "cleanliness_tasks_assigned_by_id_fkey"
            columns: ["assigned_by_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "cleanliness_tasks_assigned_by_id_fkey"
            columns: ["assigned_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleanliness_tasks_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "cleanliness_tasks_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "cleanliness_tasks_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleanliness_tasks_cl_log_id_fkey"
            columns: ["cl_log_id"]
            isOneToOne: false
            referencedRelation: "cleanliness_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleanliness_tasks_completed_by_id_fkey"
            columns: ["completed_by_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "cleanliness_tasks_completed_by_id_fkey"
            columns: ["completed_by_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "cleanliness_tasks_completed_by_id_fkey"
            columns: ["completed_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      house_invites: {
        Row: {
          created_at: string
          house_id: string
          id: number
          inviter_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          house_id: string
          id?: number
          inviter_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          house_id?: string
          id?: number
          inviter_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_invites_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_invites_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "house_invites_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "house_invites_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_invites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "house_invites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "house_invites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      houses: {
        Row: {
          address: string
          camera_id: string | null
          chatbot_active: boolean
          created_at: string
          id: string
          name: string
          owner: string
          updated_at: string
        }
        Insert: {
          address: string
          camera_id?: string | null
          chatbot_active?: boolean
          created_at?: string
          id?: string
          name?: string
          owner: string
          updated_at?: string
        }
        Update: {
          address?: string
          camera_id?: string | null
          chatbot_active?: boolean
          created_at?: string
          id?: string
          name?: string
          owner?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "houses_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "houses_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "houses_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string
          favourited: boolean
          house_id: string
          id: number
          poster_id: string
          text: string
        }
        Insert: {
          created_at?: string
          favourited?: boolean
          house_id: string
          id?: number
          poster_id: string
          text: string
        }
        Update: {
          created_at?: string
          favourited?: boolean
          house_id?: string
          id?: number
          poster_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_poster_id_fkey"
            columns: ["poster_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "notes_poster_id_fkey"
            columns: ["poster_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "notes_poster_id_fkey"
            columns: ["poster_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      owes: {
        Row: {
          amount: number
          bill_id: string
          created_at: string
          debtor_id: string
          id: string
          paid: boolean
          updated_at: string
        }
        Insert: {
          amount: number
          bill_id: string
          created_at?: string
          debtor_id: string
          id?: string
          paid?: boolean
          updated_at?: string
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string
          debtor_id?: string
          id?: string
          paid?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "owes_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["bill_id"]
          },
          {
            foreignKeyName: "owes_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owes_debtor_id_fkey"
            columns: ["debtor_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "owes_debtor_id_fkey"
            columns: ["debtor_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "owes_debtor_id_fkey"
            columns: ["debtor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          house_id: string | null
          id: string
          image_url: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          house_id?: string | null
          id?: string
          image_url: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          house_id?: string | null
          id?: string
          image_url?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      responsible: {
        Row: {
          activity_id: number | null
          created_at: string
          id: number
          profile_id: string | null
        }
        Insert: {
          activity_id?: number | null
          created_at?: string
          id?: number
          profile_id?: string | null
        }
        Update: {
          activity_id?: number | null
          created_at?: string
          id?: number
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responsible_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "chores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responsible_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["loaner_id"]
          },
          {
            foreignKeyName: "responsible_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "amounts_owed"
            referencedColumns: ["debtor_id"]
          },
          {
            foreignKeyName: "responsible_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      amounts_owed: {
        Row: {
          amount_owed: number | null
          bill_id: string | null
          bill_name: string | null
          bill_total: number | null
          created_at: string | null
          debtor_id: string | null
          debtor_name: string | null
          loaner_id: string | null
          loaner_name: string | null
          owe_id: string | null
          owed_by: string | null
          paid: boolean | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_outstanding_loans_summary_for_user: {
        Args: {
          user_id_param: string
          result_offset?: number
        }
        Returns: {
          bill_id: string
          bill_name: string
          sum_paid_back: number
          total_owed: number
        }[]
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
