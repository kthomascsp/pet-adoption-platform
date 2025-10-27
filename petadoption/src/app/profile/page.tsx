"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For client-side redirects
import { createClient } from "@/utils/supabase/client"; // Supabase client

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // Router for redirects

    useEffect(() => {
        const supabase = createClient();

        const getUserAndProfile = async () => {
            try {
                // Get the currently logged-in user
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;

                const currentUser = userData?.user ?? null;
                setUser(currentUser);

                // If no user, redirect to login page
                if (!currentUser) {
                    router.push("/login");
                    return;
                }

                // Fetch Profile data for logged-in user
                const { data: profileData, error: profileError } = await supabase
                    .from("Profile")
                    .select("*")
                    .eq("ProfileID", currentUser.id)
                    .single();

                if (profileError) throw profileError;
                setProfile(profileData);
            } catch (err) {
                console.error("Error loading profile:", err);
            } finally {
                setLoading(false);
            }
        };

        getUserAndProfile();

        // Listen for login/logout changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) {
                setProfile(null);
                router.push("/login"); // Redirect to login on logout
            }
        });

        // Cleanup listener when component unmounts
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    // Loading indicator
    if (loading) {
        return <p className="text-center mt-10 text-lg">Loading...</p>;
    }

    // Profile display
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6 mt-8">
            <h1 className="text-2xl font-semibold mb-4">
                Welcome, {profile?.ProfileName || user?.email}!
            </h1>

            <div
                className="
                    grid
                    grid-cols-1 md:grid-cols-2
                    gap-4
                    w-full max-w-4xl
                    border rounded p-6 shadow
                    bg-white text-black
                "
            >
                <div><strong>First Name:</strong> {profile?.ProfileName || "-"}</div>
                <div><strong>Last Name:</strong> {profile?.LastName || "-"}</div>
                <div><strong>Email:</strong> {user?.email}</div>
                <div><strong>Phone:</strong> {profile?.Phone || "-"}</div>
                <div><strong>Address:</strong> {profile?.Address || "-"}</div>
                <div><strong>City:</strong> {profile?.City || "-"}</div>
                <div><strong>State:</strong> {profile?.State || "-"}</div>
                <div><strong>Zip:</strong> {profile?.Zip || "-"}</div>
                <div><strong>Account Type:</strong> {profile?.ProfileType || "-"}</div>
                <div><strong>Description:</strong> {profile?.ProfileDescription || "-"}</div>
            </div>
        </div>
    );
}
