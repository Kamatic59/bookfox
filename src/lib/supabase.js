import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log environment status (only in development)
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('Supabase Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase credentials not found!')
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in environment variables')
}

// Create client with proper error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Export a function to check if properly configured
export const isConfigured = () => !!(supabaseUrl && supabaseAnonKey)
