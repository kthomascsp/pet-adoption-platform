"use client"; // 👈 required for client-side Supabase

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DbTestPage() {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

        async function fetchPets() {
            const { data, error } = await supabase.from("Pet").select("*");

            if (error) {
                console.error("Error fetching pets:", error);
                setErrorMsg(error.message);
            } else {
                setPets(data || []);
            }
            setLoading(false);
        }

        fetchPets();
    }, []);

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Database Test</h1>

            {loading && <p>Loading...</p>}
            {errorMsg && <p className="text-red-600">Error: {errorMsg}</p>}
            {!loading && !errorMsg && pets.length === 0 && (
                <p>No pets found in database.</p>
            )}

            <ul className="space-y-2">
                {pets.map((pet) => (
                    <li key={pet.PetID} className="border p-2 rounded">
                        {pet.PetName} – {pet.Species} ({pet.Status})
                    </li>
                ))}
            </ul>
        </main>
    );
}
