// https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app
import { createServerClient } from '@supabase/ssr' // Import Supabase server-side client for Next.js
import { cookies } from 'next/headers' // Import Next.js server-side cookies helper

// Factory function to create a Supabase client for server-side usage
export function createClient() {
    // Get a reference to the current request's cookies
    const cookieStore = cookies()

    // Create and return a Supabase server-side client
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase project URL from environment
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Supabase anon/public key from environment
        {
            cookies: {
                // Return all cookies as an array
                getAll() {
                    return cookieStore.getAll()
                },

                // Set multiple cookies on the response
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // If setting cookies fails, likely called in a server component
                        // during rendering; fail silently to avoid breaking user sessions.
                    }
                },
            },
        }
    )
}
