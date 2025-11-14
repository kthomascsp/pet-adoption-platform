"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Pencil } from "lucide-react";

interface ProfileAvatarProps {
    profile: {
        ImageURL?: string | null;
    };
    editable?: boolean; // if true, shows edit button & modal
    size?: number; // image diameter in pixels
    onImageUpdated?: (newUrl: string) => void; // optional callback
}

export default function ProfileAvatar({
                                          profile,
                                          editable = false,
                                          size = 80,
                                          onImageUpdated,
                                      }: ProfileAvatarProps) {
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const supabase = createClient();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const userRes = await supabase.auth.getUser();
        const user = userRes.data.user;
        if (!user) return;

        const fileExt = selectedFile.name.split(".").pop();
        const filePath = `profiles/${user.id}/profile-picture.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("ProfileImagesBucket")
            .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) {
            alert("Error uploading image: " + uploadError.message);
            return;
        }

        const { data: urlData } = supabase.storage
            .from("ProfileImagesBucket")
            .getPublicUrl(filePath);

        const imageUrl = urlData.publicUrl;

        // Save to Image table
        const { error: dbError } = await supabase
            .from("Image")
            .upsert(
                { OwnerID: user.id, ImageType: "profile", URL: imageUrl },
                { onConflict: "OwnerID, ImageType" }
            );

        if (dbError) {
            alert("Error saving image record: " + dbError.message);
            return;
        }

        // Update state
        setShowModal(false);
        onImageUpdated?.(imageUrl);
    };

    return (
        <div
            className="relative"
            style={{ width: size, height: size }}
        >
            {!profile?.ImageURL ? (
                <div className="bg-gray-200 rounded-full animate-pulse" style={{ width: size, height: size }} />
            ) : (
                <Image
                    src={profile?.ImageURL || "/shelter-generic.png"}
                    alt="Profile picture"
                    width={size}
                    height={size}
                    className="rounded-full object-cover border-2 border-gray-300"
                />
            )}

            {editable && (
                <button
                    onClick={() => setShowModal(true)}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                    <Pencil size={14} />
                </button>
            )}

            {/* Modal */}
            {editable && showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Update Profile Picture
                        </h2>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400"
                            onClick={() =>
                                document.getElementById("fileInput")?.click()
                            }
                        >
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    width={150}
                                    height={150}
                                    className="mx-auto rounded-full"
                                />
                            ) : (
                                <p className="text-gray-500">
                                    Drop a file here or click to browse
                                </p>
                            )}
                        </div>

                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
