import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

/**
 * PetsPage Component (Server Component)
 * - Displays a list of pets retrieved from Supabase
 * - Allows users to search and filter by various fields
 * - Uses server-side data fetching (no client-side JavaScript needed)
 */
export default async function PetsPage(props: { searchParams?: Record<string, string | undefined> }) {
    // ✅ Extract URL search parameters (e.g., ?city=Austin)
    const searchParams = await props.searchParams ?? {};

    let pets = [];
    let errorMessage = "";

    try {
        // ✅ Initialize Supabase client (server-side)
        const supabase = await createClient();

        // ✅ Extract individual search fields from query string
        const city = searchParams.city || "";
        const name = searchParams.name || "";
        const state = searchParams.state || "";
        const zip = searchParams.zip || "";
        const species = searchParams.species || "";
        const breed = searchParams.breed || "";
        const gender = searchParams.gender || "";
        const size = searchParams.size || "";
        const age = searchParams.age || "";

        // ✅ Start building the query to the Supabase view
        //    `pet_search_view` is a database view that includes pet info and image URL
        let query = supabase.from("pet_search_view").select("*");

        // ✅ Add filters to the query only if the corresponding search field is filled in
        if (city) query = query.ilike("City", `%${city}%`);
        if (state) query = query.ilike("State", `%${state}%`);
        if (zip) query = query.ilike("Zip", `%${zip}%`);
        if (species) query = query.ilike("Species", `%${species}%`);
        if (breed) query = query.ilike("Breed", `%${breed}%`);
        if (name) query = query.ilike("PetName", `%${name}%`);
        if (gender) query = query.ilike("Gender", `%${gender}%`);
        if (size) query = query.ilike("Size", `%${size}%`);

        // ✅ Special case: Age filter is based on Birthdate field
        if (age) {
            const ageNum = Number(age);
            if (!isNaN(ageNum)) {
                const today = new Date();
                const maxDate = new Date(today.getFullYear() - ageNum, today.getMonth(), today.getDate());
                const minDate = new Date(today.getFullYear() - ageNum - 1, today.getMonth(), today.getDate() + 1);

                // Pets born between minDate and maxDate will match the age
                query = query
                    .gte("Birthdate", minDate.toISOString())
                    .lte("Birthdate", maxDate.toISOString());
            }
        }

        // ✅ Execute Supabase query
        const { data, error } = await query;

        // ✅ Handle query errors
        if (error) {
            console.error("Supabase query error:", error);
            errorMessage = error.message;
        } else {
            pets = data || [];
        }
    } catch (err) {
        // ✅ Handle unexpected errors gracefully
        console.error("Unexpected error:", err);
        errorMessage = err instanceof Error ? err.message : String(err);
    }

    /**
     * Helper Function: calculateAge
     * - Converts a birthdate string into an age in years
     * - Returns "Unknown Age" if birthdate is missing
     */
    function calculateAge(birthdate: string): string {
        if (!birthdate) return "Unknown Age";
        const birth = new Date(birthdate);
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();

        // Adjust age if birthday hasn’t occurred yet this year
        if (monthDifference < 0) {
            return `${age - 1}`;
        }
        return `${age}`;
    }

    return (
        <div>
            {/* 🐾 Page Header */}
            <h1 className="text-3xl font-bold text-center m-8">
                Find Your Perfect Pet
            </h1>

            {/* 🔍 Search Form — sends query as GET parameters */}
            <form
                className="flex flex-col items-center justify-center m-6 w-full max-w-6xl mx-auto"
                method="GET"
            >
                {/* First row: location filters */}
                <div className="grid grid-cols-3 w-full">
                    <input type="text" name="city" placeholder="City" className="border p-3 w-full" defaultValue={searchParams.city || ""} />
                    <input type="text" name="state" placeholder="State" className="border p-3 w-full" defaultValue={searchParams.state || ""} />
                    <input type="text" name="zip" placeholder="Zip" className="border p-3 w-full" defaultValue={searchParams.zip || ""} />
                </div>

                {/* Second row: name / gender / age filters */}
                <div className="grid grid-cols-3 w-full">
                    <input type="text" name="name" placeholder="Name" className="border p-3 w-full" defaultValue={searchParams.name || ""} />
                    <select name="gender" className="border p-3 w-full" defaultValue={searchParams.gender || ""}>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input type="text" name="age" placeholder="Age" className="border p-3 w-full" defaultValue={searchParams.age || ""} />
                </div>

                {/* Third row: species / breed / size filters */}
                <div className="grid grid-cols-3 w-full">
                    <input type="text" name="species" placeholder="Species" className="border p-3 w-full" defaultValue={searchParams.species || ""} />
                    <input type="text" name="breed" placeholder="Breed" className="border p-3 w-full" defaultValue={searchParams.breed || ""} />
                    <select name="size" className="border p-3 w-full" defaultValue={searchParams.size || ""}>
                        <option value="">Size</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>

                {/* Form actions: Clear and Search */}
                <div className="flex w-full justify-center">
                    {/* Clear = just navigates back to /pets with no search params */}
                    <a
                        href="/pets"
                        className="cursor-pointer p-4 font-bold bg-red-200 text-red-500 w-[20%] text-center"
                    >
                        Clear
                    </a>

                    {/* Submitting the form triggers a new server render with updated filters */}
                    <button
                        type="submit"
                        className="cursor-pointer p-4 font-bold bg-blue-400 w-[20%]"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* 🐶 Display results or errors */}
            {errorMessage ? (
                // Error message
                <p className="text-red-400 text-center m-6">
                    No pets found: {errorMessage}
                </p>
            ) : pets.length > 0 ? (
                // ✅ Results grid — shows pet cards
                <div className="flex flex-wrap justify-center p-6 m-8">
                    {pets.map((pet) => (
                        <Link key={pet.PetID} href={`/pets/${pet.PetID}`}
                        className="cursor-pointer border m-8 p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
                            {/* Pet image (or placeholder if none) */}
                            {pet.ImageURL ? (
                                <div className="relative w-full h-48 mb-4">
                                    <Image
                                        src={pet.ImageURL}
                                        alt={pet.PetName}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg mb-4">
                                    No Image
                                </div>
                            )}

                            {/* Pet details */}
                            <h2 className="text-2xl font-semibold">
                                {pet.PetName} ({calculateAge(pet.Birthdate)} {pet.Gender?.charAt(0)})
                            </h2>
                            <p>{pet.Size} {pet.Species} - {pet.Breed}</p>
                            <p>{pet.City} {pet.State}, {pet.Zip}</p>
                            <p>{pet.PetDescription}</p>
                        </Link>
                    ))}
                </div>
            ) : (
                // Empty state message
                <p className="text-center">No pets</p>
            )}
        </div>
    );
}
