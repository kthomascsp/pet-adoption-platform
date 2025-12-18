/**
 * Handles the login and signup functionality for users.
 * - Redirects authenticated users to their profile automatically.
 * - Provides forms for both logging in and creating a new account.
 * - Integrates with Supabase Auth for authentication and user session management.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//import { login, signup } from "./actions";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { user, login, signup } = useAuth();

    const [error, setError] = useState<string | null>(null);

    // If already logged in → redirect immediately
    /*useEffect(() => {
        if (user) {
            router.replace("/profile");
        }
    }, [user, router]);*/

    // If user already logged in, prevent flicker
    /*if (user) {
        return <p className="text-center mt-10">Redirecting...</p>;
    }*/

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
                        const result = await login(
                            formData.get("email") as string,
                            formData.get("password") as string
                        );

                        if (result.error) {
                            setError(result.error);
                        } else {
                            router.replace("/profile");
                        }
                    }}
                    className="flex flex-col gap-2 border p-5 rounded shadow w-[300px]"
                >
                    <input type="email" name="email" placeholder="Email" className="border p-3 rounded" required />
                    <input type="password" name="password" placeholder="Password" className="border p-3 rounded" required />
                    <button className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 mt-2">
                        Log In
                    </button>
                    {error && (
                        <p className="text-red-500 text-sm mt-2">
                            {error}
                        </p>
                    )}
                </form>
            </div>

            <p className="text-2xl font-semibold mt-16">or</p>

            {/* Signup Form */}
            <div className="flex flex-col justify-center items-center m-4">
                <h1 className="text-2xl m-4 font-semibold">Sign Up</h1>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);

                        const formData = new FormData(e.currentTarget);
                        const result = await signup({
                            accountType: formData.get("accountType") as string,
                            firstname: formData.get("firstname") as string,
                            lastname: formData.get("lastname") as string,
                            address: formData.get("address") as string,
                            city: formData.get("city") as string,
                            state: formData.get("state") as string,
                            zip: formData.get("zip") as string,
                            phone: formData.get("phone") as string,
                            email: formData.get("email") as string,
                            password: formData.get("password") as string,
                        });

                        if (result.error) {
                            setError(result.error);
                        } else {
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
                            <input type="radio" name="accountType" value="shelter" required />
                            <span>Shelter</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="accountType" value="adopter" required />
                            <span>Adopter</span>
                        </label>
                    </div>

                    {/* Profile Info */}
                    <input type="text" name="firstname" placeholder="First Name" className="border p-3 rounded" required />
                    <input type="text" name="lastname" placeholder="Last Name" className="border p-3 rounded" required />
                    <input type="text" name="address" placeholder="Address" className="border p-3 rounded" required />
                    <input type="text" name="city" placeholder="City" className="border p-3 rounded" required />
                    <input type="text" name="state" placeholder="State" className="border p-3 rounded" required />
                    <input type="text" name="zip" placeholder="Zip" className="border p-3 rounded" required />
                    <input type="text" name="phone" placeholder="Phone" className="border p-3 rounded" required />
                    <input type="email" name="email" placeholder="Email" className="border p-3 rounded" required />
                    <input type="password" name="password" placeholder="Password" className="border p-3 rounded" required />

                    <button className="bg-green-500 text-white p-3 rounded hover:bg-green-600 mt-2">
                        Sign Up
                    </button>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
}
