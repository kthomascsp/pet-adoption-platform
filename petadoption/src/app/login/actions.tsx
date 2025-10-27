"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error("Login error:", error.message)
        return { error: error.message } // don't redirect on error
    }

    console.log(" Login successful")
    revalidatePath("/", "layout")
    redirect("/profile")
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

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
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    })

    if (signUpError) {
        console.error("Signup error:", signUpError.message)
        return { error: signUpError.message }
    }

    if (authData?.user) {
        const { error: profileError } = await supabase
            .from("Profile")
            .insert([
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
            ])

        if (profileError) {
            console.error("Profile insert error:", profileError.message)
            return { error: profileError.message }
        }

        console.log("Profile successfully created")
    } else {
        console.warn("Profile not created: no user returned from signup")
    }

    revalidatePath("/", "layout")
    redirect("/profile")
}

export async function logout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error("Logout error:", error.message)
        return { error: error.message }
    }

    console.log("Logged out successfully")
    revalidatePath("/", "layout")
    redirect("/login")
}
