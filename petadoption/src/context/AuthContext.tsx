/**
 * Provides a global authentication context for managing user state.
 * - Stores the current user's data.
 * - Offers methods for updating and clearing user state.
 * - Handles Supabase sign-out and redirects users after logout.
 */

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
    ProfileType: string;
    Address: string | null;
    City: string | null;
    State: string | null;
    Zip: string | null;
    Phone: string | null;
    ProfileEmail: string | null;
    ProfileDescription: string;
    ImageURL?: string | null;
    LastName: string | null;
} | null;

interface AuthContextType {
    user: UserType;
    profile: ProfileType;
    loading: boolean;
    setUser: (user: UserType) => void;
    setProfile: (profile: ProfileType | ((prev: ProfileType) => ProfileType)) => void;
    login: (email: string, password: string) => Promise<AuthResult>;
    signup: (form: {email: string, password: string, accountType: string, firstname: string, lastname: string, address: string, city: string,
                 state: string, zip: string, phone: string}) => Promise<AuthResult>;
    logout: () => Promise<void>;
}

type AuthResult = {
    error: string | null;
    success: boolean;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType>(null);
    const [profile, _setProfile] = useState<ProfileType>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    const fetchProfile = async (userId: string) => {
        const { data: profileData } = await supabase
            .from("profile_search_view")
            .select("*")
            .eq("ProfileID", userId)
            .single();
        //console.log("profileData: ", profileData);

        /*const { data: imageData } = await supabase
            .from("Image")
            .select("URL")
            .eq("OwnerID", userId)
            .eq("ImageType", "profile")
            .single();*/
        //console.log("imageData: ", imageData);

        const updatedProfile = {
            ProfileName: profileData?.ProfileName || null,
            ProfileType: profileData?.ProfileType,
            Address: profileData?.Address || null,
            City: profileData?.City || null,
            State: profileData?.State || null,
            Zip: profileData?.Zip || null,
            Phone: profileData?.Phone || null,
            ProfileEmail: profileData?.ProfileEmail || null,
            ProfileDescription: profileData?.ProfileDescription,
            ImageURL: profileData?.ImageURL || null,
            LastName: profileData?.LastName || null
        };

        setProfile(updatedProfile);
        //console.log("Setting profile to:", updatedProfile);
    };

    useEffect(() => {
        const initAuth = async () => {
            const { data } = await supabase.auth.getSession();
            const sessionUser = data.session?.user;

            if (sessionUser) {
                setUser({ id: sessionUser.id, email: sessionUser.email ?? "" });
                //console.log("[initAuth] sessionUser: ", sessionUser);
                await fetchProfile(sessionUser.id);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        };

        //console.log("BEFORE initAuth");
        initAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const sessionUser = session?.user;
                if (sessionUser) {
                    setUser({ id: sessionUser.id, email: sessionUser.email ?? "" });
                    //console.log("[onAuthStateChange] sessionUser: ", sessionUser);
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

    // Show a message in the console whenever the profile changes
    useEffect(() => {
        console.log("Profile updated:", profile);
    }, [profile]);

    const setProfile = (
        value: ProfileType | ((prev: ProfileType) => ProfileType)
    ) => {
        _setProfile(value);
    };

    const login = async (email: string, password: string): Promise<AuthResult> => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoading(false);
            return { error: error.message, success: false };
        }

        setLoading(false);
        return { error: null, success: true };
    };

    const signup = async (form: {
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
    }): Promise<AuthResult> => {
        setLoading(true);

        // 1. Create auth user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        });

        if (signUpError) {
            setLoading(false);
            return { error: signUpError.message, success: false };
        }

        // 2. Create profile record
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
        //console.log("Logging out");
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        router.replace("/login");
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
                logout
            }}
        >

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