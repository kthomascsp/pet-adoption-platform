/**
 * Displays the user’s authentication status in the header.
 * - Shows a "Login / Sign Up" link when not logged in.
 * - Displays the user’s email and a Logout button when logged in.
 * - Keeps state synced with Supabase Auth in real time.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function LoginStatus() {
    const { user, setUser, logout } = useAuth();
    const supabase = createClient();

    // Listen for changes in authentication state
    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user?.email) {
                setUser({ email: data.session.user.email });
            } else {
                setUser(null);
            }
        };

        fetchSession();

        // Subscribe to auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email) {
                setUser({ email: session.user.email });
            } else {
                setUser(null);
            }
        });

        // Clean up subscription on unmount
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [supabase, setUser]);

    // If no user is logged in, show login/signup link
    if (!user) {
        return (
            <Link href="/login" className="text-sm font-medium hover:underline">
                Login / Sign Up
            </Link>
        );
    }

    // If logged in, show user email and logout button
    return (
        <div className="flex items-center gap-4">
            <a href="/profile">
                <span className="text-sm">Hello, {user.email}</span>
            </a>
            
            <button
                onClick={logout}
                className="text-sm underline hover:text-red-500"
            >
                Logout
            </button>
        </div>
    );
}
