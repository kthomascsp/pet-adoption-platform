"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Define the user type (only email for now)
type UserType = { email: string } | null;

interface AuthContextType {
    user: UserType;
    setUser: (user: UserType) => void;
    logout: () => Promise<void>; // add logout function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component wraps your app
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType>(null);
    const supabase = createClient();
    const router = useRouter();

    const logout = async () => {
        await supabase.auth.signOut(); // sign out in Supabase
        setUser(null);                 // clear context immediately
        router.replace("/login");       // client-side redirect
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook for consuming auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
