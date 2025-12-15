/**
 * PetAvatar Component
 * -------------------------------------------------------
 * Displays a pet's profile image with optional editing capability.
 *
 * Features:
 * - Shows a circular profile image with configurable size.
 * - If `editable` is true, displays an edit (pencil) button.
 * - Allows selecting and previewing a new image.
 * - Uploads the image to Supabase Storage (with overwrite/upsert enabled).
 * - Stores/updates the image URL in the `Image` table.
 * - Sends the updated image URL back to the parent via `onImageUpdated`.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface PetAvatarProps {
    petID: string;
    imageUrl: string | null;
    editable?: boolean;      // Enables edit button + modal
    size?: number;           // Avatar diameter in pixels
    onImageUpdated?: (newUrl: string) => void; // Callback after successful upload
}

export default function PetAvatar({
    petID = "",  
    imageUrl = "",                                
    editable = false,
                                          size = 80,
                                          onImageUpdated,
                                      }: PetAvatarProps) {
    const { user } = useAuth();

    // Modal + upload state
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const supabase = createClient();

    /**
     * Handle file selection
     * Generates a local preview URL for the modal.
     */
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            console.log("Selected file:", file);
        }
    };

    /**
     * Uploads the selected file to Supabase Storage.
     * Also updates the Image table with the new public URL.
     */
    const handleUpload = async () => {
        if (!selectedFile || !user) return;

        const fileExt = selectedFile.name.split(".").pop();
        const uniqueTime = Date.now();
        const filePath = `pets/${petID}/avatar_${uniqueTime}.${fileExt}`;
        const folderPath = `pets/${petID}`;

        console.log(`Deleting pet images... pet.id=${petID}, filePath=${filePath}`);

        // Delete existing images for this user in the bucket
        const { data: existingFiles, error: listError } = await supabase.storage
            .from("PetImagesBucket")
            .list(folderPath);

        if (listError) {
            console.error("Error listing existing files:", listError);
        } else if (existingFiles?.length) {
            const fileNames = existingFiles.map(f => `${folderPath}/${f.name}`);
            const { error: deleteError } = await supabase.storage
                .from("PetImagesBucket")
                .remove(fileNames);
            if (deleteError) console.error("Error deleting old files:", deleteError);
            else console.log("Deleted old profile images:", fileNames);
        }

        console.log(`Uploading profile image... user.id=${petID}, filePath=${filePath}`);

        // Upload to Supabase Storage (with overwrite enabled)
        const { error:UploadError } = await supabase.storage
            .from("PetImagesBucket")
            .upload(filePath, selectedFile, { upsert: true });

        if (UploadError) {
            console.log("Upload error:", UploadError);
            return;
        }

        console.log("Uploaded successfully.");

        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
            .from("PetImagesBucket")
            .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;
        console.log("Public URL:", publicUrl);

        // Upsert into Image table
        const { error: dbError } = await supabase
            .from("Image")
            .upsert(
                { OwnerID: petID, ImageType: "pet", URL: publicUrl },
                { onConflict: "OwnerID,ImageType" }
            );

        if (dbError) {
            alert("Error saving image record: " + dbError.message);
            return;
        }

        console.log("Image table updated.");

        // Close modal and notify parent component
        setShowModal(false);
        onImageUpdated?.(`${publicUrl}?t=${uniqueTime}`);
    };

    return (
        <div
            className="relative"
            style={{ width: size, height: size }}
        >
            {/* Avatar Image or loading placeholder */}
            <div
  className="rounded-full overflow-hidden border-2 border-gray-300"
  style={{ width: size, height: size }}
>
  <img
    src={imageUrl || "/dog-generic.png"}
    alt="Pet pic"
    width={size}
    height={size}
    className="w-full h-full object-cover"
  />
</div>


            {/* Edit (pencil) button */}
            {editable && (
                <button
                    onClick={() => setShowModal(true)}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                    <Pencil size={14} />
                </button>
            )}

            {/* Upload modal */}
            {editable && showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Update Profile Picture
                        </h2>

                        {/* Preview or drop zone */}
                        <div
                            className={`border-2 rounded-xl p-6 text-center cursor-pointer transition 
                                ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"} 
                                hover:border-gray-400`}
                            onClick={() => document.getElementById("fileInput")?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true); // show visual feedback
                            }}
                            onDragEnter={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                setIsDragging(false); // remove feedback
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false); // remove feedback after drop
                                const file = e.dataTransfer.files[0];
                                if (file) {
                                    setSelectedFile(file);
                                    setPreviewUrl(URL.createObjectURL(file));
                                    console.log("Dropped file:", file);
                                }
                            }}
                        >
                            {previewUrl ? (
                                <div className="rounded-full overflow-hidden w-36 h-36 mx-auto">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        width={150}
                                        height={150}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-500">Drop a file here or click to browse</p>
                            )}
                        </div>


                        {/* Hidden file input */}
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        {/* Modal actions */}
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
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
