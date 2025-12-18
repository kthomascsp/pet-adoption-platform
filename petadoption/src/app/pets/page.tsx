import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import PetFilters from "@/components/PetFilters";

type PageProps = {
    searchParams?: Promise<Record<string, string | undefined>>;
};

/* Server page: fetch filter options once, apply URL filters, show pet results*/
export default async function PetsPage({ searchParams }: PageProps) {

    const resolvedSearchParams = (await searchParams) ?? {};

    let pets: any[] = [];
    let errorMessage = "";

    // Raw filter options
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
        const species = toLower(resolvedSearchParams.species);
        const gender  = toLower(resolvedSearchParams.gender);
        const size    = toLower(resolvedSearchParams.size);
        const breed   = resolvedSearchParams.breed?.trim();

        // 3. Build result query
        let query = supabase
            .from("pet_search_view")
            .select("*")
            .eq("Status", "available");

        if (resolvedSearchParams.city)
            query = query.ilike("City", `%${resolvedSearchParams.city}%`);
        if (resolvedSearchParams.state)
            query = query.ilike("State", `%${resolvedSearchParams.state}%`);
        if (resolvedSearchParams.zip)
            query = query.ilike("Zip", `%${resolvedSearchParams.zip}%`);
        if (resolvedSearchParams.name)
            query = query.ilike("PetName", `%${resolvedSearchParams.name}%`);
        if (species) query = query.eq("Species", species);
        if (breed)   query = query.ilike("Breed", `%${breed}%`);
        if (gender)  query = query.eq("Gender", gender);
        if (size)    query = query.eq("Size", size);

        // Age filter: birthdate range
        if (resolvedSearchParams.age) {
            const ageNum = Number(resolvedSearchParams.age);
            if (!isNaN(ageNum) && ageNum > 0) {
                const today = new Date();
                const max = new Date(
                    today.getFullYear() - ageNum,
                    today.getMonth(),
                    today.getDate()
                );
                const min = new Date(
                    today.getFullYear() - ageNum - 1,
                    today.getMonth(),
                    today.getDate() + 1
                );
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
        if (
            t.getMonth() < b.getMonth() ||
            (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())
        )
            age--;
        return age < 0 ? "0" : `${age}`;
    };

    return (
        <div className="min-h-screen">
            <h1 className="text-3xl font-bold text-center my-8">
                Find Your Perfect Pet
            </h1>

            <form method="GET" className="mx-auto max-w-6xl space-y-4">
                <PetFilters
                    searchParams={resolvedSearchParams}
                    speciesList={speciesList}
                    breedList={breedList}
                    genderList={genderList}
                    sizeList={sizeList}
                />

                <div className="flex justify-center gap-4">
                    <Link
                        href="/pets"
                        className="px-6 py-2 bg-red-200 text-red-600 rounded cursor-pointer hover:bg-red-300 transition"
                    >
                        Clear
                    </Link>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition"
                    >
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
                    <div className="flex flex-wrap justify-center gap-8 p-6 w-[80%] mx-auto">
                        {pets.map((p: any) => (
                            <Link
                                key={p.PetID}
                                href={`/pets/${p.PetID}`}
                                className="w-80 border rounded-lg p-4 hover:shadow-lg transition text-center flex flex-col items-center"
                            >
                                {p.ImageURL ? (
                                    <div className="relative w-full h-64 mb-3">
                                        <Image
                                            src={p.ImageURL || "dog-generic.png"}
                                            alt={p.PetName}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full h-64 mb-3">
                                        <Image
                                            src={"/dog-generic.png"}
                                            alt={p.PetName}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold">
                                    {p.PetName} ({calculateAge(p.Birthdate)} {p.Gender?.[0]})
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {p.Size} {p.Species} – {p.Breed}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {p.City}, {p.State} {p.Zip}
                                </p>
                                <p className="text-sm mt-1 line-clamp-2">
                                    {p.PetDescription}
                                </p>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 mt-10">
                    No pets match your filters.
                </p>
            )}
        </div>
    );
}