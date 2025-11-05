/**
 * Defines server-side authentication actions for login, signup, and logout.
 * - Integrates with Supabase for authentication and user profile creation.
 * - Handles redirects and revalidation for seamless navigation after auth actions.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Logs a user in using Supabase email/password authentication.
 */
export async function login(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    });

    if (error) {
        return { error: error.message };
    }

    // Refresh app layout and redirect to profile
    revalidatePath("/", "layout");
    redirect("/profile");
}

/**
 * Registers a new user in Supabase Auth and creates their profile record.
 */
export async function signup(formData: FormData): Promise<{ error?: string }> {
    const supabase = await createClient();

    // Extract user data from form fields
    const data = {
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
    };

    // 1. Create a new Supabase Auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });

    if (signUpError) {
        console.error("Signup error:", signUpError.message);
        return { error: signUpError.message };
    }

    // 2. Create a user profile entry linked to their Auth user ID
    if (authData?.user) {
        const { error: profileError } = await supabase.from("Profile").insert([
            {
                ProfileID: authData.user.id,
                ProfileType: data.accountType,
                ProfileName: data.firstname,
                LastName: data.lastname,
                Address: data.address,
                City: data.city,
                State: data.state,
                Zip: data.zip,
                Phone: data.phone,
                ProfileEmail: data.email,
            },
        ]);

        if (profileError) {
            console.error("Profile insert error:", profileError.message);
            return { error: profileError.message };
        }

        console.log("Profile successfully created");
    } else {
        console.warn("Profile not created: no user returned from signup");
        return {};
    }

    // 3. Refresh app and redirect to profile page
    revalidatePath("/", "layout");
    redirect("/profile");
}

/**
 * Logs out the current user and redirects to the login page.
 */
export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut(); // Ensures session cookie is cleared
    revalidatePath("/", "layout");
    redirect("/login");
}
