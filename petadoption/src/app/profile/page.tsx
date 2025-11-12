/**
 * Displays the authenticated user's profile information.
 * - Fetches user authentication state via Supabase.
 * - Retrieves the user's profile from the "Profile" table.
 * - Redirects to /login if the user is not logged in.
 * - Updates in real-time on auth state changes.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ProfileAvatar from "@/components/ProfileAvatar";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        const fetchUserData = async () => {
            // Get authenticated user
            const { data: userData } = await supabase.auth.getUser();
            const currentUser = userData?.user ?? null;
            setUser(currentUser);

            if (!currentUser) {
                router.push("/login"); // Redirect if not logged in
                return;
            }

            // Fetch profile data for current user
            const { data: profileData } = await supabase
                .from("Profile")
                .select("*")
                .eq("ProfileID", currentUser.id)
                .single();

            const { data: imageData } = await supabase
                .from("Image")
                .select("URL")
                .eq("OwnerID", currentUser.id)
                .eq("ImageType", "profile")
                .single();

            setProfile({ ...profileData, ImageURL: imageData?.URL || null });

            //setProfile(profileData);
            setLoading(false);
        };

        fetchUserData();

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                if (!session?.user) {
                    setProfile(null);
                    router.push("/login");
                }
            }
        );

        return () => {
            authListener?.subscription.unsubscribe(); // Clean up listener
        };
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    const supabase = createClient();

    console.log("Attempting to save profile for user:", user.id);

    const { data, error, status } = await supabase
        .from("Profile")
        .update({
        ProfileName: profile.ProfileName,
        LastName: profile.LastName,
        ProfileEmail: profile.ProfileEmail,
        Phone: profile.Phone,
        Address: profile.Address,
        City: profile.City,
        State: profile.State,
        Zip: profile.Zip,
        ProfileType: profile.ProfileType,
        ProfileDescription: profile.ProfileDescription,
        })
        .eq("ProfileID", user.id) // change this if needed
        .select();

    console.log("Update result:", { data, error, status });

    setSaving(false);

    if (error) {
        alert("Error saving profile: " + error.message);
    }
    else {
        alert("Profile updated successfully!");
    }
    };


    if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

    // Allow the user to upload a profile picture
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        //alert("Uploading...");
        const supabase = createClient();

        // DEBUG - check the current user
        const { data: userCheck } = await supabase.auth.getUser();
        console.log("User ID:", user.id);
        console.log("OwnerID being inserted:", user.id);

        const file = event.target.files?.[0];
        if (!file || !user) return;

        //const filePath = file.name;
        const cleanFileName = file.name.replace(/[^\w.-]/g, "_");
        const filePath = `profiles/${user.id}/profile-picture.${file.name.split('.').pop()}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from("ProfileImagesBucket")
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            alert("Error uploading image: " + uploadError.message);
            return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("ProfileImagesBucket")
            .getPublicUrl(filePath);

        const imageUrl = urlData.publicUrl;

        const { error: deleteError } = await supabase
            .from("Image")
            .delete()
            .eq("OwnerID", user.id)
            .eq("ImageType", "profile");

        if (deleteError) {
            alert("Error deleting image: " + deleteError.message);
        }

        // Save new image record to the Image table
        const { data: insertData, error: insertError } = await supabase
            .from("Image")
            .insert([
                {
                    OwnerID: user.id,
                    ImageType: "profile",
                    URL: imageUrl,
                },
            ]);

        if (insertError) {
            alert("Error saving image record: " + insertError.message);
        } else {
            alert("Profile picture updated successfully!");
            console.log("Inserted image record:", insertData);

            // Update UI with the new image
            setProfile((prev: any) => ({ ...prev, ImageURL: imageUrl }));
        }
    };


    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6 mt-8">
            <h1 className="text-2xl font-semibold mb-4">
                Welcome, {profile?.ProfileName || user?.email}!
            </h1>

            <ProfileAvatar
                profile={profile}
                editable
                size={128}
                onImageUpdated={(newUrl) => setProfile((prev: any) => ({ ...prev, ImageURL: newUrl }))}
                />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl border rounded p-6 shadow bg-white text-black">
                <div><strong>First Name:</strong> <input type="text" name="ProfileName" placeholder={`${profile?.ProfileName || ""}`} 
                value={profile?.ProfileName || ""} onChange={handleChange}/></div>
                <div><strong>Last Name:</strong> <input type="text" name="LastName" placeholder={`${profile?.LastName || ""}`} 
                value={profile?.LastName || ""} onChange={handleChange}/></div>
                <div><strong>Email:</strong> <input type="text" name="ProfileEmail" placeholder={`${profile?.ProfileEmail || ""}`} 
                value={profile?.ProfileEmail || ""} onChange={handleChange}/></div>
                <div><strong>Phone:</strong> <input type="text" name="Phone" placeholder={`${profile?.Phone || ""}`} 
                value={profile?.Phone || ""} onChange={handleChange}/></div>
                <div><strong>Address:</strong> <input type="text" name="Address" placeholder={`${profile?.Address || ""}`} 
                value={profile?.Address || ""} onChange={handleChange}/></div>
                <div><strong>City:</strong> <input type="text" name="City" placeholder={`${profile?.City || ""}`} 
                value={profile?.City || ""} onChange={handleChange}/></div>
                <div><strong>State:</strong> <input type="text" name="State" placeholder={`${profile?.State || ""}`} 
                value={profile?.State || ""} onChange={handleChange}/></div>
                <div><strong>Zip:</strong> <input type="text" name="Zip" placeholder={`${profile?.Zip || ""}`} 
                value={profile?.Zip || ""} onChange={handleChange}/></div>
                <div>
                    <strong><label htmlFor="ProfileType">Account Type:</label></strong>
                    <select id="ProfileType" name="ProfileType" value={profile?.ProfileType || ""} onChange={handleChange}>
                        <option value="">-- Select --</option>
                        <option value="adopter">Adopter</option>
                        <option value="shelter">Shelter</option>
                    </select>
                </div>
                <div><strong>Description:</strong> <input type="text" name="ProfileDescription" placeholder={`${profile?.ProfileDescription || ""}`} 
                value={profile?.ProfileDescription || ""} onChange={handleChange}/></div>
            </div>
            <button onClick={handleSave} disabled={saving} className="m-6 py-6 px-20 bg-green-400 hover:bg-green-600 border rounded cursor-pointer">
                {saving ? "Saving" : "Saved"}
            </button>
        </div>
    );
}
