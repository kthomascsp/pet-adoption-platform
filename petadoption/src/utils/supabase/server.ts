/**
 * Creates a Supabase client for server-side usage in Next.js.
 * - Uses server cookies to persist sessions securely.
 * - Supports Next.js 14's async cookie handling.
 * - Used in server actions, loaders, and API routes.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Initializes a Supabase client for server-side contexts.
 * Automatically reads and writes authentication cookies
 * to maintain the user's session between requests.
 */
export async function createClient() {
    const cookieStore = await cookies(); // Next.js 14: must be awaited

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // Retrieves all cookies for the current request
                getAll() {
                    return cookieStore.getAll();
                },
                // Sets or updates cookies in the response
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignore cookie writes during server rendering
                    }
                },
            },
        }
    );
}
