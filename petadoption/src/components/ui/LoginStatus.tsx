/**
 * Displays the user’s authentication status in the header.
 * - Shows a "Login / Sign Up" link when not logged in.
 * - Displays the user’s name, avatar, and a Logout button when logged in.
 * - Keeps state synced with Supabase Auth in real time.
 */

// LoginStatus.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileAvatar from "@/components/ProfileAvatar";

export default function LoginStatus() {
    const { user, profile, loading, logout } = useAuth();

    if (loading) {
        return <span className="text-sm">Loading...</span>;
    }

    if (!user) {
        return (
            <Link href="/login" className="text-sm font-medium hover:underline">
                Login / Sign Up
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-2">
                <ProfileAvatar profile={profile || {}} size={36} />
                <span className="text-sm">
          {profile?.ProfileName || user.email}
        </span>
            </Link>
            <button onClick={logout} className="text-sm underline hover:text-red-500">
                Logout
            </button>
        </div>
    );
}