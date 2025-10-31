import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import PetFilters from "@/components/PetFilters";

/* Server page: fetch filter options once, apply URL filters, show pet results */
export default async function PetsPage(props: {
    searchParams?: Record<string, string | undefined>;
}) {
    const searchParams = await props.searchParams ?? {};

    let pets: any[] = [];
    let errorMessage = "";

    // Raw filter options (lowercase in DB)
    let speciesList: string[] = [];
    let breedList: string[] = [];
    let genderList: string[] = [];
    let sizeList: string[] = [];

    try {
        const supabase = await createClient();

        // 1. Get distinct values for dropdowns
        const { data: filterData, error: filterError } = await supabase
            .from("pet_search_view")
            .select("Species, Breed, Gender, Size")
            .eq("Status", "available");

        if (filterError) throw filterError;

        if (filterData?.length) {
            const uniq = {
                species: new Set<string>(),
                breed: new Set<string>(),
                gender: new Set<string>(),
                size: new Set<string>(),
            };

            for (const r of filterData) {
                const s = r.Species?.trim().toLowerCase();
                const b = r.Breed?.trim();
                const g = r.Gender?.trim().toLowerCase();
                const z = r.Size?.trim().toLowerCase();

                if (s) uniq.species.add(s);
                if (b) uniq.breed.add(b);
                if (g) uniq.gender.add(g);
                if (z) uniq.size.add(z);
            }

            // Sort and assign to lists
            speciesList = Array.from(uniq.species).sort();
            breedList   = Array.from(uniq.breed).sort();
            genderList  = Array.from(uniq.gender).sort();
            sizeList    = Array.from(uniq.size).sort();
        }

        // 2. Normalize search params
        const toLower = (s?: string) => s?.trim().toLowerCase() || "";
        const species = toLower(searchParams.species);
        const gender  = toLower(searchParams.gender);
        const size    = toLower(searchParams.size);
        const breed   = searchParams.breed?.trim();

        // 3. Build result query
        let query = supabase.from("pet_search_view").select("*").eq("Status", "available");

        if (searchParams.city)   query = query.ilike("City", `%${searchParams.city}%`);
        if (searchParams.state)  query = query.ilike("State", `%${searchParams.state}%`);
        if (searchParams.zip)    query = query.ilike("Zip", `%${searchParams.zip}%`);
        if (searchParams.name)   query = query.ilike("PetName", `%${searchParams.name}%`);
        if (species) query = query.eq("Species", species);
        if (breed)   query = query.ilike("Breed", `%${breed}%`);
        if (gender)  query = query.eq("Gender", gender);
        if (size)    query = query.eq("Size", size);

        // Age filter: birthdate range
        if (searchParams.age) {
            const ageNum = Number(searchParams.age);
            if (!isNaN(ageNum) && ageNum > 0) {
                const today = new Date();
                const max = new Date(today.getFullYear() - ageNum, today.getMonth(), today.getDate());
                const min = new Date(today.getFullYear() - ageNum - 1, today.getMonth(), today.getDate() + 1);
                query = query
                    .gte("Birthdate", min.toISOString().split("T")[0])
                    .lte("Birthdate", max.toISOString().split("T")[0]);
            }
        }

        // Execute query
        const { data, error } = await query;
        if (error) {
            console.error(error);
            errorMessage = error.message;
        } else {
            pets = data ?? [];
        }
    } catch (e) {
        console.error(e);
        errorMessage = e instanceof Error ? e.message : String(e);
    }

    // Calculate age from birthdate
    const calculateAge = (birthdate: string) => {
        if (!birthdate) return "Unknown";
        const b = new Date(birthdate);
        const t = new Date();
        let age = t.getFullYear() - b.getFullYear();
        if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
        return age < 0 ? "0" : `${age}`;
    };

    return (
        <div className="min-h-screen">
            <h1 className="text-3xl font-bold text-center my-8">Find Your Perfect Pet</h1>

            <form method="GET" className="mx-auto max-w-6xl space-y-4">
                <PetFilters
                    searchParams={searchParams}
                    speciesList={speciesList}
                    breedList={breedList}
                    genderList={genderList}
                    sizeList={sizeList}
                />

                <div className="flex justify-center gap-4">
                    <Link href="/pets" className="px-6 py-2 bg-red-200 text-red-600 rounded cursor-pointer hover:bg-red-300 transition">
                        Clear
                    </Link>
                    <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition">
                        Search
                    </button>
                </div>
            </form>

            {errorMessage ? (
                <p className="text-center text-red-500 mt-6">{errorMessage}</p>
            ) : pets.length ? (
                <>
                    <p className="text-center font-medium mt-6">
                        Found {pets.length} {pets.length === 1 ? "pet" : "pets"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 p-6">
                        {pets.map((p: any) => (
                            <Link
                                key={p.PetID}
                                href={`/pets/${p.PetID}`}
                                className="w-80 border rounded-lg p-4 hover:shadow-lg transition text-center flex flex-col items-center"
                            >
                                {p.ImageURL ? (
                                    <div className="relative w-full h-48 mb-3">
                                        <Image src={p.ImageURL} alt={p.PetName} fill className="object-cover rounded" />
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-3">
                                        No Image
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold">
                                    {p.PetName} ({calculateAge(p.Birthdate)} {p.Gender?.[0]})
                                </h2>
                                <p className="text-sm text-gray-600">{p.Size} {p.Species} – {p.Breed}</p>
                                <p className="text-sm text-gray-600">{p.City}, {p.State} {p.Zip}</p>
                                <p className="text-sm mt-1 line-clamp-2">{p.PetDescription}</p>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 mt-10">No pets match your filters.</p>
            )}
        </div>
    );
}