"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function DbTestPage() {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Filters
    const [filters, setFilters] = useState({
        name: "",
        city: "",
        state: "",
        zip: "",
        species: "",
        breed: "",
        size: "",
        gender: "",
        age: "",
        description: "",
    });

    // Dropdown options
    const speciesOptions = ["", "Dog", "Cat", "Bird", "Rabbit", "Other"];
    const sizeOptions = ["", "Small", "Medium", "Large"];
    const genderOptions = ["", "Male", "Female"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const fetchPets = async () => {
        setLoading(true);
        setErrorMsg(null);
        const supabase = createClient();

        let query = supabase.from("pet_search_view").select("*");

        if (filters.name) query = query.ilike("PetName", `%${filters.name}%`);
        if (filters.city) query = query.ilike("City", `%${filters.city}%`);
        if (filters.state) query = query.ilike("State", `%${filters.state}%`);
        if (filters.zip) query = query.ilike("Zip", `%${filters.zip}%`);
        if (filters.species) query = query.ilike("Species", `%${filters.species}%`);
        if (filters.breed) query = query.ilike("Breed", `%${filters.breed}%`);
        if (filters.size) query = query.ilike("Size", `%${filters.size}%`);
        if (filters.gender) query = query.ilike("Gender", `%${filters.gender}%`);
        if (filters.description) query = query.ilike("PetDescription", `%${filters.description}%`);

        if (filters.age) {
            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - parseInt(filters.age));
            query = query.lte("Birthdate", minDate.toISOString());
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching pets:", error);
            setErrorMsg(error.message);
            setPets([]);
        } else {
            setPets(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchPets();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchPets();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [filters]);

    return (
        <main className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Pet Search</h1>

            {/* Search Filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Text Inputs */}
                <input
                    type="text"
                    name="name"
                    placeholder="Pet Name"
                    value={filters.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="breed"
                    placeholder="Breed"
                    value={filters.breed}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={filters.city}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={filters.state}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="zip"
                    placeholder="Zip"
                    value={filters.zip}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Max Age (years)"
                    value={filters.age}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={filters.description}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                {/* Dropdowns */}
                <select
                    name="species"
                    value={filters.species}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    {speciesOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt || "Species"}
                        </option>
                    ))}
                </select>

                <select
                    name="size"
                    value={filters.size}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    {sizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt || "Size"}
                        </option>
                    ))}
                </select>

                <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    {genderOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt || "Gender"}
                        </option>
                    ))}
                </select>
            </div>

            {/* Results Count */}
            {!loading && !errorMsg && (
                <p className="text-gray-700">
                    {pets.length > 0
                        ? `${pets.length} result${pets.length !== 1 ? "s" : ""} found`
                        : "No results found"}
                </p>
            )}

            {loading && <p>Loading...</p>}
            {errorMsg && <p className="text-red-600">Error: {errorMsg}</p>}

            {/* Results Grid */}
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pets.map((pet) => (
                    <li key={pet.PetID} className="border rounded-lg overflow-hidden shadow">
                        {/* Pet Image */}
                        {pet.ImageURL ? (
                            <div className="relative w-full h-48">
                                <Image
                                    src={pet.ImageURL}
                                    alt={pet.PetName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}

                        {/* Pet Info */}
                        <div className="p-3">
                            <p className="font-semibold text-lg">{pet.PetName}</p>
                            <p className="text-sm text-gray-700">
                                {pet.Breed} – {pet.Size}, {pet.Gender}
                            </p>
                            <p className="text-sm text-gray-700">
                                {pet.City}, {pet.State} {pet.Zip}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">{pet.PetDescription}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
