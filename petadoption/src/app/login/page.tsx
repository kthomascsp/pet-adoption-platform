"use client" // This page is a client component

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client" // Supabase client
import { login, signup, logout } from "./actions" // Auth actions

export default function LoginPage() {
    // State for logged-in user
    const [user, setUser] = useState<any>(null)
    // State for user's profile data from Profile table
    const [profile, setProfile] = useState<any>(null)
    // Loading state for async fetch
    const [loading, setLoading] = useState(true)
    // Error state for login form
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        const getUserAndProfile = async () => {
            try {
                // Fetch currently logged-in user from Supabase
                const { data: userData, error: userError } = await supabase.auth.getUser()
                if (userError) throw userError

                const currentUser = userData?.user ?? null
                setUser(currentUser) // Store user in state

                // If user exists, fetch their Profile data
                if (currentUser) {
                    const { data: profileData, error: profileError } = await supabase
                        .from("Profile")
                        .select("*") // Fetch all columns
                        .eq("ProfileID", currentUser.id) // Match by user ID
                        .single() // Expect only one row
                    if (profileError) throw profileError
                    setProfile(profileData) // Store profile in state
                }

                setLoading(false) // Done loading
            } catch (err: any) {
                console.error(err)
                setLoading(false)
            }
        }

        getUserAndProfile()

        // Listen for auth state changes (login/logout)
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (!session?.user) setProfile(null) // Clear profile on logout
        })

        // Cleanup subscription on unmount
        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    // Display a loading indicator while fetching data
    if (loading) {
        return <p className="text-center mt-10 text-lg">Loading...</p>
    }

    // If user is logged in, show their profile information
    if (user) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6">
                {/* Welcome message */}
                <h1 className="text-2xl font-semibold mb-4">
                    Welcome, {profile?.ProfileName || user.email}!
                </h1>

                {/* Display all profile information in a responsive grid */}
                <div className="
                    grid
                    grid-cols-1 md:grid-cols-2   /* 1 column on mobile, 2 on medium screens */
                    gap-4                       /* 1rem gap between cells */
                    w-full max-w-4xl            /* Full width up to 1024px */
                    border rounded p-6 shadow   /* Card styling */
                    bg-white text-black          /* Background and text colors */
                ">
                    <div><strong>First Name:</strong> {profile?.ProfileName || "-"}</div>
                    <div><strong>Last Name:</strong> {profile?.LastName || "-"}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Phone:</strong> {profile?.Phone || "-"}</div>
                    <div><strong>Address:</strong> {profile?.Address || "-"}</div>
                    <div><strong>City:</strong> {profile?.City || "-"}</div>
                    <div><strong>State:</strong> {profile?.State || "-"}</div>
                    <div><strong>Zip:</strong> {profile?.Zip || "-"}</div>
                    <div><strong>Account Type:</strong> {profile?.ProfileType || "-"}</div>
                    <div><strong>Description:</strong> {profile?.ProfileDescription || "-"}</div>
                </div>

                {/* Log out button (commented out for now) */}
                {/* <form action={logout}>
                    <button
                        type="submit"
                        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 mt-4"
                    >
                        Log Out
                    </button>
                </form> */}
            </div>
        )
    }

    // If no user is logged in, display login and signup forms
    return (
        <div className="flex items-start justify-evenly p-8 flex-wrap">
            {/* Login Form */}
            <div className="flex flex-col justify-center items-center m-4">
                <h1 className="text-2xl m-4 font-semibold">Login</h1>
                <form
                    action={async (formData) => {
                        const result = await login(formData)
                        if (result?.error) setError(result.error) // Display login error
                    }}
                    className="flex flex-col gap-2 border p-5 rounded shadow w-[300px]"
                >
                    <input type="email" name="email" placeholder="Email" className="border p-3 rounded w-full" required />
                    <input type="password" name="password" placeholder="Password" className="border p-3 rounded w-full" required />
                    <button type="submit" className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 w-full mt-2">Log In</button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>

            {/* Separator */}
            <p className="text-2xl font-semibold mt-16">or</p>

            {/* Signup Form */}
            <div className="flex flex-col justify-center items-center m-4">
                <h1 className="text-2xl m-4 font-semibold">Sign Up</h1>
                <form action={signup} className="flex flex-col gap-2 border p-5 rounded shadow w-[300px]">
                    {/* Account Type Selection */}
                    <div className="flex justify-center items-center m-2">
                        <h2 className="text-xl font-medium">Select Account Type</h2>
                    </div>
                    <div className="flex space-x-6 justify-evenly m-2">
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="accountType" value="shelter" className="h-5 w-5 text-blue-600 focus:ring-blue-500" required />
                            <span className="text-lg">Shelter</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="accountType" value="adopter" className="h-5 w-5 text-blue-600 focus:ring-blue-500" required />
                            <span className="text-lg">Adopter</span>
                        </label>
                    </div>

                    {/* Signup Inputs */}
                    <input type="text" name="firstname" placeholder="First Name" className="border p-3 rounded w-full" required />
                    <input type="text" name="lastname" placeholder="Last Name" className="border p-3 rounded w-full" required />
                    <input type="text" name="address" placeholder="Address" className="border p-3 rounded w-full" required />
                    <input type="text" name="city" placeholder="City" className="border p-3 rounded w-full" required />
                    <input type="text" name="state" placeholder="State" className="border p-3 rounded w-full" required />
                    <input type="text" name="zip" placeholder="Zip" className="border p-3 rounded w-full" required />
                    <input type="text" name="phone" placeholder="Phone" className="border p-3 rounded w-full" required />
                    <input type="email" name="email" placeholder="Email" className="border p-3 rounded w-full" required />
                    <input type="password" name="password" placeholder="Password" className="border p-3 rounded w-full" required />

                    {/* Signup Submit Button */}
                    <button type="submit" className="bg-green-500 text-white p-3 rounded hover:bg-green-600 w-full mt-2">Sign Up</button>
                </form>
            </div>
        </div>
    )
}
