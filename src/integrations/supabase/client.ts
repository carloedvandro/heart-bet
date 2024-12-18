import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mwdaxgwuztccxfgbusuj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZGF4Z3d1enRjY3hmZ2J1c3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDAzMjUsImV4cCI6MjA0ODk3NjMyNX0.UGchGQoLkRq2fCULNsOdJAXVwNWrK97PurzflQ2heMk";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
});

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any stored tokens
    localStorage.removeItem('supabase.auth.token');
    // Optionally clear other auth-related storage
    localStorage.removeItem('supabase.auth.refreshToken');
  } else if (event === 'SIGNED_IN' && session) {
    // Ensure the session is properly stored
    localStorage.setItem('supabase.auth.token', session.access_token);
    if (session.refresh_token) {
      localStorage.setItem('supabase.auth.refreshToken', session.refresh_token);
    }
  }
  
  console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
});

// Initialize session from storage if exists
const initializeSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error initializing session:', error);
    // Clear potentially corrupted session data
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.refreshToken');
  } else if (session) {
    console.log('Session initialized successfully');
  }
};

initializeSession().catch(console.error);