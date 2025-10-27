"use client"; // This page is a client component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Import router for redirects
import { createClient } from "@/utils/supabase/client";
import { login, signup } from "./actions"; // ✅ logout not needed here

export default function LoginPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // ✅ router instance for redirects

    useEffect(() => {
        const supabase = createClient();

        const getUserAndProfile = async () => {
            try {
                // Get current user
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;

                const currentUser = userData?.user ?? null;
                setUser(currentUser);

                // If user exists, redirect to /profile
                if (currentUser) {
                    router.push("/profile");
                    return;
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching user:", err);
                setLoading(false);
            }
        };

        getUserAndProfile();

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const loggedInUser = session?.user ?? null;
            setUser(loggedInUser);
            if (loggedInUser) router.push("/profile"); // Redirect after login
        });

        // Cleanup on unmount
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    // Loading state
    if (loading) {
        return <p className="text-center mt-10 text-lg">Loading...</p>;
    }

    // If no user, show login/signup forms
    return (
        <div className="flex items-start justify-evenly p-8 flex-wrap">
            {/* Login Form */}
            <div className="flex flex-col justify-center items-center m-4">
                <h1 className="text-2xl m-4 font-semibold">Login</h1>
                <form
                    action={async (formData) => {
                        const result = await login(formData);
                        if (result?.error) {
                            setError(result.error);
                        } else {
                            // Redirect after successful login
                            router.push("/profile");
                        }
                    }}
                    className="flex flex-col gap-2 border p-5 rounded shadow w-[300px]"
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 w-full mt-2"
                    >
                        Log In
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>

            {/* Separator */}
            <p className="text-2xl font-semibold mt-16">or</p>

            {/* Signup Form */}
            <div className="flex flex-col justify-center items-center m-4">
                <h1 className="text-2xl m-4 font-semibold">Sign Up</h1>
                <form
                    action={signup}
                    className="flex flex-col gap-2 border p-5 rounded shadow w-[300px]"
                >
                    {/* Account Type Selection */}
                    <div className="flex justify-center items-center m-2">
                        <h2 className="text-xl font-medium">Select Account Type</h2>
                    </div>
                    <div className="flex space-x-6 justify-evenly m-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="accountType"
                                value="shelter"
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                required
                            />
                            <span className="text-lg">Shelter</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="accountType"
                                value="adopter"
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                required
                            />
                            <span className="text-lg">Adopter</span>
                        </label>
                    </div>

                    {/* Signup Inputs */}
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="zip"
                        placeholder="Zip"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="border p-3 rounded w-full"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="border p-3 rounded w-full"
                        required
                    />

                    {/* Signup Submit Button */}
                    <button
                        type="submit"
                        className="bg-green-500 text-white p-3 rounded hover:bg-green-600 w-full mt-2"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
