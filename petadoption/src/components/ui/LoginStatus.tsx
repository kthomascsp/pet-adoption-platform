/**
 * Displays the user’s authentication status in the header.
 * - Shows a "Login / Sign Up" link when not logged in.
 * - Displays the user’s name, avatar, and a Logout button when logged in.
 * - Keeps state synced with Supabase Auth in real time.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";
import ProfileAvatar from "@/components/ProfileAvatar";

export default function LoginStatus() {
    const { user, setUser, logout } = useAuth();
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);

    // Listen for authentication changes
    useEffect(() => {
        const fetchSessionAndProfile = async () => {
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const currentUser = data.session.user;
                setUser({ email: currentUser.email });

                // Fetch profile name and image
                const { data: profileData } = await supabase
                    .from("Profile")
                    .select("ProfileName")
                    .eq("ProfileID", currentUser.id)
                    .single();

                const { data: imageData } = await supabase
                    .from("Image")
                    .select("URL")
                    .eq("OwnerID", currentUser.id)
                    .eq("ImageType", "profile")
                    .single();

                setProfile({
                    ...profileData,
                    ImageURL: imageData?.URL || null,
                });
            } else {
                setUser(null);
                setProfile(null);
            }
        };

        fetchSessionAndProfile();

        // Subscribe to auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user?.email) {
                    setUser({ email: session.user.email });
                } else {
                    setUser(null);
                    setProfile(null);
                }
            }
        );

        // Clean up
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [supabase, setUser]);

    // If not logged in
    if (!user) {
        return (
            <Link href="/login" className="text-sm font-medium hover:underline">
                Login / Sign Up
            </Link>
        );
    }

    // Logged-in state
    return (
        <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-2">
                <ProfileAvatar profile={profile} size={36} />
                <span className="text-sm">
                    {profile?.ProfileName || user.email}
                </span>
            </Link>

            <button
                onClick={logout}
                className="text-sm underline hover:text-red-500"
            >
                Logout
            </button>
        </div>
    );
}
