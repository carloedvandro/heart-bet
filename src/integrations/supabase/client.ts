import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mwdaxgwuztccxfgbusuj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZGF4Z3d1enRjY3hmZ2J1c3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4OTA2NzUsImV4cCI6MjA1MDQ2NjY3NX0.aDSnR8hyCM-E7qBZg5lcP5IN9zl80ViyI5jKxl77J-w";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
    debug: true // Enable debug mode to help troubleshoot auth issues
  }
});

// Log auth state changes for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { event, session });
});