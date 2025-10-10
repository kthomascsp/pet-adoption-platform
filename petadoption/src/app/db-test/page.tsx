"use client"; // 👈 Required for client-side rendering in Next.js app directory

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Import function to create Supabase client

export default function DbTestPage() {
    // State to hold the list of pets retrieved from the database
    const [pets, setPets] = useState<any[]>([]);

    // State to indicate if the page is currently loading data
    const [loading, setLoading] = useState(false);

    // State to store any error messages from Supabase queries
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // State object for filters used in search inputs
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

    // Options for dropdowns (static for now, could also be fetched from DB)
    const speciesOptions = ["", "Dog", "Cat", "Bird", "Rabbit", "Other"];
    const sizeOptions = ["", "Small", "Medium", "Large"];
    const genderOptions = ["", "Male", "Female"];

    /**
     * handleChange: Updates the corresponding filter value when an input/select changes
     * @param e - The change event from an input or select element
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value })); // Update the filters state dynamically
    };

    /**
     * fetchPets: Queries Supabase to retrieve pets based on the current filters
     */
    const fetchPets = async () => {
        setLoading(true); // Show loading state
        setErrorMsg(null); // Clear any previous error
        const supabase = createClient(); // Create Supabase client

        // Start query from the view we created in Supabase
        let query = supabase.from("pet_search_view").select("*");

        // Dynamically add filters using ilike (case-insensitive LIKE)
        if (filters.name) query = query.ilike("PetName", `%${filters.name}%`);
        if (filters.city) query = query.ilike("City", `%${filters.city}%`);
        if (filters.state) query = query.ilike("State", `%${filters.state}%`);
        if (filters.zip) query = query.ilike("Zip", `%${filters.zip}%`);
        if (filters.species) query = query.ilike("Species", `%${filters.species}%`);
        if (filters.breed) query = query.ilike("Breed", `%${filters.breed}%`);
        if (filters.size) query = query.ilike("Size", `%${filters.size}%`);
        if (filters.gender) query = query.ilike("Gender", `%${filters.gender}%`);
        if (filters.description)
            query = query.ilike("PetDescription", `%${filters.description}%`);

        // Age filter: converts age in years to Birthdate cutoff
        if (filters.age) {
            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - parseInt(filters.age));
            query = query.lte("Birthdate", minDate.toISOString()); // Less than or equal to cutoff date
        }

        // Execute the query
        const { data, error } = await query;

        if (error) {
            // Handle errors
            console.error("Error fetching pets:", error);
            setErrorMsg(error.message);
            setPets([]); // Clear pets list on error
        } else {
            setPets(data || []); // Save data or empty array
        }
        setLoading(false); // Done loading
    };

    /**
     * Initial fetch when component mounts
     * useEffect with empty dependency array runs only once
     */
    useEffect(() => {
        fetchPets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Auto-update search results when filters change
     * Adds a 500ms debounce to avoid excessive API calls
     */
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchPets();
        }, 500);

        return () => clearTimeout(delayDebounce); // Cleanup previous timeout
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return (
        <main className="p-6 space-y-6">
            {/* Page title */}
            <h1 className="text-2xl font-bold">Pet Search</h1>

            {/* Filter Inputs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Text inputs for various filter fields */}
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
                            {opt || "Species"} {/* Show placeholder if empty */}
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

            {/* Results */}
            {loading && <p>Loading...</p>}
            {errorMsg && <p className="text-red-600">Error: {errorMsg}</p>}

            <ul className="space-y-2">
                {/* Map over pets and display details */}
                {pets.map((pet) => (
                    <li key={pet.PetID} className="border p-3 rounded">
                        <p className="font-semibold">
                            {pet.PetName} ({pet.Species})
                        </p>
                        <p>
                            {pet.Breed} – {pet.Size}, {pet.Gender}
                        </p>
                        <p>
                            Location: {pet.City}, {pet.State} {pet.Zip}
                        </p>
                        <p>{pet.PetDescription}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
