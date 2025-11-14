"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitApplication(formData: FormData) {
    const supabase = await createClient();

    // -------------------------------------------------
    // 1. Make sure the user is logged in
    // -------------------------------------------------
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthenticated");

    // -------------------------------------------------
    // 2. Pull the PetID from the hidden field (set in the form)
    // -------------------------------------------------
    const petId = formData.get("PetID") as string | null;
    if (!petId) throw new Error("Pet ID missing");

    // -------------------------------------------------
    // 3. Build the object that matches the Application table
    // -------------------------------------------------
    const application = {
        ProfileID: user.id,
        PetID: petId,
        ResidenceType: formData.get("ResidenceType") as string,
        OwnOrRent: formData.get("OwnOrRent") as string,
        HouseholdMembers: Number(formData.get("HouseholdMembers")),
        HasAllergies: formData.get("HasAllergies") === "true",
        CurrentPets: (formData.get("CurrentPets") as string) || null,
        PreviousPets: (formData.get("PreviousPets") as string) || null,
        HoursAlonePerDay: Number(formData.get("HoursAlonePerDay")),
        PetLocationWhenAlone: formData.get("PetLocationWhenAlone") as string,
        PetSleepLocation: formData.get("PetSleepLocation") as string,
        VetName: (formData.get("VetName") as string) || null,
        VetPhone: (formData.get("VetPhone") as string) || null,
        WhyAdopt: formData.get("WhyAdopt") as string,
        ExperienceWithPets: formData.get("ExperienceWithPets") as string,
        References: (formData.get("References") as string) || null,
        AgreedToTerms: formData.get("AgreedToTerms") === "on",
        Signature: formData.get("Signature") as string,
    };

    // -------------------------------------------------
    // 4. Insert
    // -------------------------------------------------
    const { error } = await supabase.from("Application").insert(application);

    if (error) throw error;

    // -------------------------------------------------
    // 5. Success → revalidate + redirect
    // -------------------------------------------------
    revalidatePath(`/pets/${petId}`);
    redirect(`/pets/${petId}?applied=true`);
}