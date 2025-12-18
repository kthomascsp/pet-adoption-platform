// app/auth/signout/route.ts
import { createClient } from "@/utils/supabase/server"; // Import Supabase server-side client
import { redirect } from "next/navigation"; // Import Next.js redirect function

// Handles POST requests to sign the user out
export async function POST() {
    try {
        // Initialize Supabase server client
        const supabase = await createClient();

        // Attempt to sign out the current user
        const { error } = await supabase.auth.signOut();

        // If there is an error, log it but do NOT throw
        if (error) {
            console.error("Sign out issue:", error.message);
            // Optionally, you could set a client-side notification here
        }

        // Redirect to the homepage regardless of sign-out success
        redirect("/");
    } catch (err: unknown) {
        // Log any unexpected errors
        console.error("Unexpected error during sign out:", err);

        // Redirect anyway to avoid blocking the user
        redirect("/");
    }
}
