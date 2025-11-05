/**
 * Provides a global authentication context for managing user state.
 * - Stores the current user's data (email for now).
 * - Offers methods for updating and clearing user state.
 * - Handles Supabase sign-out and redirects users after logout.
 */

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Defines the shape of a user object (only email for now)
type UserType = { email: string } | null;

interface AuthContextType {
    user: UserType;
    setUser: (user: UserType) => void;
    logout: () => Promise<void>;
}

// Create an authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the app and makes
 * authentication data/functions available to all components.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType>(null); // Holds current user info
    const supabase = createClient(); // Supabase client for auth operations
    const router = useRouter();

    /**
     * Logs out the user:
     * - Ends the Supabase session
     * - Clears local user state
     * - Redirects to the login page
     */
    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.replace("/login");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook for accessing authentication context.
 * Throws an error if used outside of AuthProvider.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
