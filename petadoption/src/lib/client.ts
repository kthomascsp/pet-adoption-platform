/**
 * Initializes a standard Supabase client for browser and server use.
 * - Uses the public Supabase URL and anon key from environment variables.
 * - Provides direct access to the Supabase JavaScript client API.
 * - Commonly imported by hooks and components that need to read/write data.
 */

import { createClient } from '@supabase/supabase-js';

// Public Supabase credentials (safe to expose in frontend builds)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Shared Supabase client instance used throughout the app.
 * Used mainly in client-side utilities like real-time chat hooks.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
