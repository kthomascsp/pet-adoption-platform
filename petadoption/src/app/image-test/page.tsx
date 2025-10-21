"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function ImageTestPage() {
    // Local state for pets, loading indicator, and error messages
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Fetch pets with their image URLs
    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true);
            const supabase = createClient();

            // Fetch everything from the view
            const { data, error } = await supabase
                .from("pet_with_images_view")
                .select("*");

            if (error) {
                console.error("Error fetching pets with images:", error);
                setErrorMsg(error.message);
                setPets([]);
                setLoading(false);
                return;
            }

            // Group multiple images per PetID (since the view joins Pet → Image)
            const groupedPets = Object.values(
                data.reduce((acc: any, row: any) => {
                    if (!acc[row.PetID]) {
                        acc[row.PetID] = {
                            PetID: row.PetID,
                            PetName: row.PetName,
                            Species: row.Species,
                            Breed: row.Breed,
                            Size: row.Size,
                            Gender: row.Gender,
                            PetDescription: row.PetDescription,
                            Status: row.Status,
                            ProfileID: row.ProfileID,
                            Images: [],
                        };
                    }
                    if (row.URL) {
                        acc[row.PetID].Images.push({
                            URL: row.URL,
                            Description: row.ImageDescription,
                        });
                    }
                    return acc;
                }, {})
            );

            setPets(groupedPets);
            setLoading(false);
        };

        fetchPets();
    }, []);

    // JSX Rendering
    return (
        <main className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Pet Images</h1>

            {/* Status messages */}
            {loading && <p>Loading...</p>}
            {errorMsg && <p className="text-red-600">Error: {errorMsg}</p>}
            {!loading && !errorMsg && pets.length === 0 && (
                <p>No pets or images found.</p>
            )}

            {/* Pet Grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                    <li key={pet.PetID} className="border p-4 rounded-lg shadow-sm bg-white">
                        <div className="space-y-2">
                            <p className="font-semibold text-lg">{pet.PetName}</p>
                            <p className="text-gray-700">
                                {pet.Species} – {pet.Breed} ({pet.Gender})
                            </p>
                            <p className="text-gray-600 text-sm">{pet.PetDescription}</p>
                            <p className="text-xs text-gray-500 italic">
                                Status: {pet.Status}
                            </p>
                        </div>

                        {/* Image Gallery */}
                        {pet.Images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                {pet.Images.map((img: any, i: number) => (
                                    <div key={i} className="relative w-full h-40">
                                        <Image
                                            src={img.URL}
                                            alt={img.Description || pet.PetName}
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-gray-500 italic text-sm">
                                No image available
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </main>
    );
}
