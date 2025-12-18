/**
 * Provides a global authentication context for managing user state.
 * - Stores the current user's data.
 * - Offers methods for updating and clearing user state.
 * - Handles Supabase sign-out and redirects users after logout.
 */

"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// --- Types ---
type User = {
    id: string;
    email: string;
} | null;

type Profile = {
    ProfileName: string | null;
    ProfileType: string;
    Address: string | null;
    City: string | null;
    State: string | null;
    Zip: string | null;
    Phone: string | null;
    ProfileEmail: string | null;
    ProfileDescription: string;
    ImageURL: string | null;
    LastName: string | null;
} | null;

type AuthResult = {
    error: string | null;
    success: boolean;
};

interface AuthContextType {
    user: User;
    profile: Profile;
    loading: boolean;
    setUser: (u: User) => void;
    setProfile: (p: Profile | ((prev: Profile) => Profile)) => void;
    login: (email: string, password: string) => Promise<AuthResult>;
    signup: (form: SignupForm) => Promise<AuthResult>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<NonNullable<Profile>>) => Promise<AuthResult>;
}

type SignupForm = {
    email: string;
    password: string;
    accountType: string;
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Stable Supabase client instance
    const supabase = useRef(createClient()).current;

    const [user, setUser] = useState<User>(null);
    const [profile, setProfile] = useState<Profile>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // Fetch profile from view
    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from("profile_search_view")
            .select("*")
            .eq("ProfileID", userId)
            .single();

        if (!data) return;

        setProfile({
            ProfileName: data.ProfileName ?? null,
            ProfileType: data.ProfileType,
            Address: data.Address ?? null,
            City: data.City ?? null,
            State: data.State ?? null,
            Zip: data.Zip ?? null,
            Phone: data.Phone ?? null,
            ProfileEmail: data.ProfileEmail ?? null,
            ProfileDescription: data.ProfileDescription,
            ImageURL: data.ImageURL ?? null,
            LastName: data.LastName ?? null,
        });
    };

    // Initial session load + listener
    useEffect(() => {
        let ignore = false; // Guard for Strict Mode double-run

        const init = async () => {
            const { data } = await supabase.auth.getSession();
            const sessionUser = data.session?.user;

            if (ignore) return;

            if (sessionUser) {
                setUser({ id: sessionUser.id, email: sessionUser.email ?? "" });
                await fetchProfile(sessionUser.id);
            } else {
                setUser(null);
                setProfile(null);
            }

            setLoading(false);
        };

        init();

        // Listen for login/logout events
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
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
            ignore = true;
            listener.subscription.unsubscribe();
        };
    }, [supabase]);

    // --- Auth Actions ---

    const login = async (email: string, password: string): Promise<AuthResult> => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        setLoading(false);
        if (error) return { error: error.message, success: false };
        return { error: null, success: true };
    };

    const signup = async (form: SignupForm): Promise<AuthResult> => {
        setLoading(true);

        // Create Supabase auth user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        });

        if (signUpError) {
            setLoading(false);
            return { error: signUpError.message, success: false };
        }

        // Insert profile row
        if (authData?.user) {
            const { error: profileError } = await supabase.from("Profile").insert([
                {
                    ProfileID: authData.user.id,
                    ProfileType: form.accountType,
                    ProfileName: form.firstname,
                    LastName: form.lastname,
                    Address: form.address,
                    City: form.city,
                    State: form.state,
                    Zip: form.zip,
                    Phone: form.phone,
                    ProfileEmail: form.email,
                },
            ]);

            if (profileError) {
                setLoading(false);
                return { error: profileError.message, success: false };
            }
        }

        setLoading(false);
        return { error: null, success: true };
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            return;
        }

        setUser(null);
        setProfile(null);

        router.replace("/login");
    };

    const updateProfile = async (
        updates: Partial<NonNullable<Profile>>
    ): Promise<AuthResult> => {
        if (!user) return { error: "No user", success: false };

        const { error } = await supabase
            .from("Profile")
            .update({ ...updates })
            .eq("ProfileID", user.id);

        if (error) return { error: error.message, success: false };

        // Merge into local state
        setProfile((prev) => (prev ? { ...prev, ...updates } : prev));

        return { error: null, success: true };
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                setUser,
                setProfile,
                login,
                signup,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
