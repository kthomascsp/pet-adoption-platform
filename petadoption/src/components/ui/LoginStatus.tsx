"use client"; // Mark this component as a client component (can use hooks and browser APIs)

import Link from "next/link"; // For navigation links
import { usePathname } from "next/navigation"; // Hook to get the current URL path

// Define the props expected by the component
interface LoginStatusProps {
    user: any; // Supabase user object or null
    displayName: string; // Name to display for logged-in user
}

export default function LoginStatus({ user, displayName }: LoginStatusProps) {
    const pathname = usePathname(); // Get the current URL path

    // If the user is not logged in and is on the login page,
    // hide the login button to avoid showing it on the login page
    if (!user && pathname === "/login") {
        return null;
    }

    return (
        <div className="flex items-center space-x-3">
            {user ? (
                <>
                    {/* Show a welcome message with the user's name */}
                    <span className="opacity-90">
                        Welcome, <strong>{displayName}</strong>
                    </span>

                    {/* Logout button in a form to trigger server-side signout */}
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        >
                            Log out
                        </button>
                    </form>
                </>
            ) : (
                <>
                    {/* If no user is logged in, show login/sign-up link */}
                    <Link
                        href="/login"
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                        Login / Sign Up
                    </Link>
                </>
            )}
        </div>
    );
}
