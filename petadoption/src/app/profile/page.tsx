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
import { createClient } from "@/utils/supabase/client";
import ApplicationItem from "@/components/ApplicationItem"

export default function ProfilePage() {
    const { user, profile, loading, setProfile, updateProfile } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const supabase = createClient();
    const [applications, setApplications] = useState<any[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const isShelter = profile?.ProfileType === "shelter" || false;


    useEffect(() => {
        // Redirect if not logged in
        if (!loading && !user) {
            router.replace("/login");
        }

        // Get adoption applications
        const loadApplications = async () => {
            if (!user) return;

            if (isShelter) {
                // SHELTER VIEW: applications for pets owned by shelter
                const { data, error } = await supabase
                    .from("application_search_view")
                    .select("*")
                    .eq("ShelterProfileID", user.id)     // <-- KEY CHANGE
                    .order("ApplicationDateTime", { ascending: false });

                if (error) console.log("Error getting shelter application info:", error);
                else setApplications(data || []);

            } else {
                // ADOPTER VIEW: applications submitted by this user
                const { data, error } = await supabase
                    .from("application_search_view")
                    .select("*")
                    .eq("ApplicantProfileID", user.id)
                    .order("ApplicationDateTime", { ascending: false });

                if (error) console.log("Error getting user application info:", error);
                else setApplications(data || []);
            }

            console.log("Retrieved applications | isShelter: ", isShelter);

            setLoadingApps(false);
        };

        loadApplications();
    }, [loading, user, profile]);

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

    // Update application status
    const handleUpdateStatus = async (appId: number, newStatus: string) => {
        /*console.log("Updating status on table: Application", {
            appId,
            newStatus,
            user
        });*/

        const { data, error } = await supabase
            .from("Application")
            .update({ Status: newStatus })
            .eq("ApplicationID", appId)
            .select();

        console.log("Update result:", data, error);
        if (error) alert("Error updating status: " + error.message);

        // Refresh UI
        setApplications(prev =>
            prev.map(a =>
                a.ApplicationID === appId ? { ...a, Status: newStatus } : a
            )
        );
    };

    // Update shelter notes
    const handleUpdateNotes = async (appId: number, notes: string) => {
        /*console.log("Updating notes on table: Application", {
            appId,
            notes,
            user
        });*/

        const { data, error } = await supabase
            .from("Application")
            .update({ ShelterNotes: notes })
            .eq("ApplicationID", appId)
            .select();

        console.log("Update result:", data, error);
        if (error) alert("Error updating notes: " + error.message);

        // Refresh UI
        setApplications(prev =>
            prev.map(a =>
                a.ApplicationID === appId ? { ...a, ShelterNotes: notes } : a
            )
        );
    };


    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6 mt-8">
            {/* Greeting and profile pic section */}
            <h1 className="text-2xl font-semibold mb-4">
                Welcome, {profile?.ProfileName || user?.email}!
            </h1>
            <ProfileAvatar
                editable
                size={128}
                onImageUpdated={(newUrl) =>
                    setProfile((prev: any) => ({ ...prev, ImageURL: newUrl }))
                }
            />

            {/* Adoption applications section */}
            <div className="flex flex-col items-center justify-center p-6 mt-10 border rounded shadow bg-white text-black">
                <h2 className="text-xl font-semibold mb-4">Your Adoption Applications</h2>

                {loadingApps && <p>Loading applications...</p>}

                {!loadingApps && applications.length === 0 && isShelter && (
                    <p>No adoption applications have been submitted for the pets you have available.</p>
                )}

                {!loadingApps && applications.length === 0 && !isShelter && (
                    <p>You have not submitted any adoption applications yet.</p>
                )}

                {/* Filter bar */}
                {applications.length > 0 && (
                    <div className="flex items-center space-x-3 mb-4">
                        <label className="font-medium">Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border p-2 rounded bg-white text-black"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                )}

                {/* Applications list */}
                <div className="space-y-4">
                    {applications
                        .filter(app => statusFilter === "all" || app.Status === statusFilter)
                        .map(app => (
                            <ApplicationItem
                                key={app.ApplicationID}
                                app={app}
                                isShelter={isShelter}
                                onUpdateStatus={handleUpdateStatus}
                                onUpdateNotes={handleUpdateNotes}
                            />
                        ))}
                </div>
            </div>

            {/* Profile details section */}
            <div className="flex flex-col items-center justify-center p-6 border rounded shadow bg-white text-black">
                <div className="text-xl font-semibold mb-4">
                    Profile Details
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
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
                <div className="mt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>


        </div>
    );
}

