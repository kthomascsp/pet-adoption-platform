/**
 * Provides a global authentication context for managing user state.
 * - Stores the current user's data (email for now).
 * - Offers methods for updating and clearing user state.
 * - Handles Supabase sign-out and redirects users after logout.
 */

// AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type UserType = {
    id: string;
    email: string;
} | null;

type ProfileType = {
    ProfileName?: string;
    ImageURL?: string | null;
} | null;

interface AuthContextType {
    user: UserType;
    profile: ProfileType;
    loading: boolean;
    setUser: (user: UserType) => void;
    setProfile: (profile: ProfileType) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType>(null);
    const [profile, setProfile] = useState<ProfileType>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    const fetchProfile = async (userId: string) => {
        const { data: profileData } = await supabase
            .from("Profile")
            .select("ProfileName")
            .eq("ProfileID", userId)
            .single();

        const { data: imageData } = await supabase
            .from("Image")
            .select("URL")
            .eq("OwnerID", userId)
            .eq("ImageType", "profile")
            .single();

        setProfile({
            ProfileName: profileData?.ProfileName || null,
            ImageURL: imageData?.URL || null,
        });
    };

    useEffect(() => {
        const initAuth = async () => {
            const { data } = await supabase.auth.getSession();
            const sessionUser = data.session?.user;

            if (sessionUser) {
                setUser({ id: sessionUser.id, email: sessionUser.email ?? "" });
                await fetchProfile(sessionUser.id);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        };

        initAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const sessionUser = session?.user;
                if (sessionUser) {
                    setUser({ id: sessionUser.id, email: sessionUser.email ?? "" });
                    await fetchProfile(sessionUser.id);
                } else {
                    setUser(null);
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        router.replace("/login");
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, setUser, setProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}