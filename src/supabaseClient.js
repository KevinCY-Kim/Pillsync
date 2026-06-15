import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase keys are configured and are not default placeholder values
export const isSupabaseConfigured = 
  !!supabaseUrl && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  !!supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

// Initialize client only if configured to prevent console errors
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
