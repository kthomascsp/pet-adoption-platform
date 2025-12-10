/**
 * Creates a Supabase client for client-side usage in the browser.
 * - Uses the public Supabase URL and key.
 * - Enables client-side features like authentication and queries.
 * - Used in React components, hooks, and context providers.
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * Initializes a Supabase client for the browser.
 * This version should be used only in client components.
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        }
    );
}
