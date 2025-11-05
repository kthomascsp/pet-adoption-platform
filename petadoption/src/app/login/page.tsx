"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { login, signup } from "./actions";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setUser } = useAuth(); // ← get setUser from AuthContext
    const supabase = createClient();

    useEffect(() => {
        let mounted = true;

        const checkUser = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;

                const currentUser = data.session?.user ?? null;

                if (mounted) {
                    if (currentUser?.email) {
                        setUser({ email: currentUser.email }); // ← update context immediately
                        router.replace("/profile");
                    } else {
                        setLoading(false);
                    }
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("Auth check error:", err.message);
                } else {
                    console.error("Auth check error:", err);
                }
                if (mounted) setLoading(false);
            }
        };

        checkUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            if (mounted) {
                if (session?.user?.email) {
                    setUser({ email: session.user.email });
                    router.replace("/profile");
                }
            }
        });

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, [router, setUser, supabase]);

    if (loading) {
        return <p className="text-center mt-10 text-lg">Loading...</p>;
    }

    return (
        <div className="flex items-start justify-evenly p-8 flex-wrap">
            {/* Login Form */}
            <div className="flex flex-col justify-center items-center m-4">
                <h1 className="text-2xl m-4 font-semibold">Login</h1>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);

                        const formData = new FormData(e.currentTarget);
                        const result = await login(formData);

                        if (result?.error) {
                            setError(result.error);
                        } else {
                            const email = formData.get("email") as string;
                            setUser({ email }); // ← update context immediately
                            router.replace("/profile");
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

            <p className="text-2xl font-semibold mt-16">or</p>

            {/* Signup Form */}
            <div className="flex flex-col justify-center items-center m-4">
                <h1 className="text-2xl m-4 font-semibold">Sign Up</h1>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();

                        const formData = new FormData(e.currentTarget);
                        const result = await signup(formData);

                        if (result?.error) {
                            setError(result.error);
                        } else {
                            const email = formData.get("email") as string;
                            setUser({ email }); // ← update context immediately
                            router.replace("/profile");
                        }
                    }}
                    className="flex flex-col gap-2 border p-5 rounded shadow w-[300px]"
                >
                    {/* Account Type */}
                    <div className="flex justify-center items-center m-2">
                        <h2 className="text-xl font-medium">Select Account Type</h2>
                    </div>
                    <div className="flex space-x-6 justify-evenly m-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="accountType"
                                value="shelter"
                                className="h-5 w-5 text-blue-600"
                                required
                            />
                            <span className="text-lg">Shelter</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="accountType"
                                value="adopter"
                                className="h-5 w-5 text-blue-600"
                                required
                            />
                            <span className="text-lg">Adopter</span>
                        </label>
                    </div>

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
