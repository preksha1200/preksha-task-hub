import { createClient } from '@supabase/supabase-js'

// Direct configuration - no validation to eliminate potential issues
const supabaseUrl = 'https://jkojyeourqfbihjfgjxi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb2p5ZW91cnFmYmloamZnanhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzkxNzksImV4cCI6MjA3MjMxNTE3OX0.HWgq8qzhw1-N12kGE891mMi20whinZUmFGLDdVxMM3A'

console.log('Creating Supabase client with:')
console.log('URL:', supabaseUrl)
console.log('Key length:', supabaseAnonKey.length)

// Create Supabase client with additional options to handle CORS
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
})

console.log('Supabase client created successfully')

export { supabase }

// Database types (will be auto-generated from Supabase later)
export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          notes: string | null
          is_completed: boolean
          created_at: string
          updated_at: string
          priority: 'High' | 'Medium' | 'Low'
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          notes?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
          priority?: 'High' | 'Medium' | 'Low'
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          notes?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
          priority?: 'High' | 'Medium' | 'Low'
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
