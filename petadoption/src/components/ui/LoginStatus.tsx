"use client";

import { useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function LoginStatus() {
    const { user, setUser, logout } = useAuth();
    const supabase = createClient();

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

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email) {
                setUser({ email: session.user.email });
            } else {
                setUser(null);
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [supabase, setUser]);

    if (!user) {
        return (
            <Link href="/login" className="text-sm font-medium hover:underline">
                Login / Sign Up
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <span className="text-sm">Hello, {user.email}</span>
            <button
                onClick={logout} // just call context logout
                className="text-sm underline hover:text-red-500"
            >
                Logout
            </button>
        </div>
    );
}
