"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function TestStoragePage() {
    // Create client (client-side)
    const supabase = createClient();

    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [bucketName, setBucketName] = useState("test-bucket");

    async function handleUpload() {
        if (!file) {
            setMessage("No file selected.");
            return;
        }

        const filePath = `${Date.now()}-${file.name}`;

        console.log("Uploading to: [bucket]: ", bucketName, " [filePath]: ", filePath);

        const { data, error } = await supabase.storage
            .from(bucketName) // <-- Change bucket if needed
            .upload(filePath, file);

        if (error) {
            console.error("Upload error:", error);
            setMessage("Upload failed: " + error.message);
        } else {
            console.log("Upload success:", data);

            const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            setMessage(`Upload succeeded! Public URL: ${urlData.publicUrl}`);
        }
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Supabase Storage Test Page</h1>

            <p>Select a file and upload it to your Supabase Storage bucket.</p>

            <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <button
                onClick={handleUpload}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    cursor: "pointer",
                    background: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                }}
            >
                Upload Test File
            </button>

            {message && (
                <div style={{ marginTop: "20px", color: "blue", whiteSpace: "pre-wrap" }}>
                    {message}
                </div>
            )}
        </div>
    );
}
