"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Pet {
    PetID: number;
    PetName: string;
    Species: string;
    Breed: string;
    Birthdate: string;
    Size: string;
    Gender: string;
    PetDescription: string;
    Status: string;
}

export default function EditablePetsTable({ shelterId }: { shelterId: string }) {
    const supabase = createClient();

    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPets() {
            const { data, error } = await supabase
                .from("Pet")
                .select("*")
                .eq("ProfileID", shelterId);

            if (!error && data) setPets(data);
            setLoading(false);
        }

        loadPets();
    }, [shelterId]);

    async function updatePet(pet: Pet) {
        const { error } = await supabase
            .from("Pet")
            .update({
                PetName: pet.PetName,
                Species: pet.Species,
                Breed: pet.Breed,
                Birthdate: pet.Birthdate,
                Size: pet.Size,
                Gender: pet.Gender,
                PetDescription: pet.PetDescription,
                Status: pet.Status
            })
            .eq("PetID", pet.PetID);

        if (error) alert("Failed to update pet.");
        else alert("Submitted Request");//Would fail if not shelter, add dynamic error in the future
    }

    function editField(petId: number, key: keyof Pet, value: string) {
        setPets((prev) =>
            prev.map((p) =>
                p.PetID === petId ? { ...p, [key]: value } : p
            )
        );
    }

    if (loading) return <p>Loading pets…</p>;

    if (pets.length === 0) return <p>No pets found for this shelter.</p>;

    return (
        <table className="border mt-10">
            <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Species</th>
                    <th className="p-2 border">Breed</th>
                    <th className="p-2 border">Birthdate</th>
                    <th className="p-2 border">Size</th>
                    <th className="p-2 border">Gender</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Save</th>
                </tr>
            </thead>
            <tbody>
                {pets.map((pet) => (
                    <tr key={pet.PetID}>
                        {Object.entries(pet).filter(([key]) =>
                            ["PetName", "Species", "Breed", "Birthdate", "Size", "Gender", "PetDescription", "Status"].includes(key)).map(([key, value]) => (
                                <td key={key} className="border">
                                    <input className="w-full border" value={value ?? ""} onChange={(e) =>
                                        editField(pet.PetID, key as keyof Pet, e.target.value)
                                    }/>
                                </td>
                            ))}

                        <td className="p-2 border text-center">
                            <button
                                onClick={() => updatePet(pet)}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                                Save
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
