/**
 * Displays the authenticated user's profile information.
 * - Fetches user authentication state via Supabase.
 * - Retrieves the user's profile from the "Profile" table.
 * - Redirects to /login if the user is not logged in.
 * - Updates in real-time on auth state changes.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileAvatar from "@/components/ProfileAvatar";

export default function ProfilePage() {
    const { user, profile, loading, setProfile, updateProfile, uploadProfileImage } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    // Show a loading message until profile finishes loading
    if (loading || !profile) {
        return <p className="text-center mt-10 text-lg">Loading...</p>;
    }

    // Input change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setProfile((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Save updated profile
    const handleSave = async () => {
        if (!profile) return;

        setSaving(true);
        const { error } = await updateProfile(profile);
        setSaving(false);

        if (error) alert("Error saving profile: " + error);
        else alert("Profile updated successfully!");
    };

    // Upload profile picture
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const { error } = await uploadProfileImage(file);

        if (error) alert("Error uploading image: " + error);
        else alert("Profile picture updated!");
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
                onImageUpdated={(newUrl) =>
                    setProfile((prev: any) => ({ ...prev, ImageURL: newUrl }))
                }
            />

            {/* Upload photo input */}
            <input type="file" className="mt-3" onChange={handleFileChange} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl border rounded p-6 shadow bg-white text-black">
                <div>
                    <strong>First Name:</strong>{" "}
                    <input
                        type="text"
                        name="ProfileName"
                        value={profile?.ProfileName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <strong>Last Name:</strong>{" "}
                    <input
                        type="text"
                        name="LastName"
                        value={profile?.LastName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <strong>Email:</strong>{" "}
                    <input
                        type="text"
                        name="ProfileEmail"
                        value={profile?.ProfileEmail || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <strong>Phone:</strong>{" "}
                    <input
                        type="text"
                        name="Phone"
                        value={profile?.Phone || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <strong>Address:</strong>{" "}
                    <input
                        type="text"
                        name="Address"
                        value={profile?.Address || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <strong>City:</strong>{" "}
                    <input
                        type="text"
                        name="City"
                        value={profile?.City || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <strong>State:</strong>{" "}
                    <input
                        type="text"
                        name="State"
                        value={profile?.State || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <strong>Zip:</strong>{" "}
                    <input
                        type="text"
                        name="Zip"
                        value={profile?.Zip || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <strong>Account Type:</strong>{" "}
                    <select
                        name="ProfileType"
                        value={profile?.ProfileType || ""}
                        onChange={handleChange}
                    >
                        <option value="">-- Select --</option>
                        <option value="adopter">Adopter</option>
                        <option value="shelter">Shelter</option>
                    </select>
                </div>

                <div>
                    <strong>Description:</strong>{" "}
                    <input
                        type="text"
                        name="ProfileDescription"
                        value={profile?.ProfileDescription || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="m-6 py-6 px-20 bg-green-400 hover:bg-green-600 border rounded cursor-pointer"
            >
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}

