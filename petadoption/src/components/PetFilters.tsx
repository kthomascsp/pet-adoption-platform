"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

interface Props {
    searchParams: Record<string, string | undefined>;
    speciesList: string[];  // lowercase from server
    breedList: string[];    // mixed case
    genderList: string[];   // lowercase
    sizeList: string[];     // lowercase
}

/* Capitalize first letter for UI display */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* Client component: dynamic dropdowns that update via Supabase queries */
export default function PetFilters({
                                       searchParams,
                                       speciesList,
                                       breedList,
                                       genderList,
                                       sizeList,
                                   }: Props) {
    // Controlled filter state from URL
    const [species, setSpecies] = useState(searchParams.species ?? "");
    const [breed, setBreed]     = useState(searchParams.breed ?? "");
    const [gender, setGender]   = useState(searchParams.gender ?? "");
    const [size, setSize]       = useState(searchParams.size ?? "");

    // Dynamic dropdown options (updated from DB)
    const [optSpecies, setOptSpecies] = useState<string[]>(speciesList.map(cap));
    const [optBreeds,  setOptBreeds]  = useState<string[]>(breedList);
    const [optGenders, setOptGenders] = useState<string[]>(genderList.map(cap));
    const [optSizes,   setOptSizes]   = useState<string[]>(sizeList.map(cap));

    const supabase = createClient();

    /* Fetch distinct values for one column, applying other active filters */
    const fetchOptions = useCallback(
        async (column: string, currentFilters: Record<string, string>) => {
            let q = supabase
                .from("pet_search_view")
                .select(column)
                .eq("Status", "available");

            // Apply filters except the one being fetched
            if (currentFilters.species) q = q.eq("Species", currentFilters.species.toLowerCase());
            if (currentFilters.breed)   q = q.ilike("Breed", `%${currentFilters.breed}%`);
            if (currentFilters.gender)  q = q.eq("Gender", currentFilters.gender.toLowerCase());
            if (currentFilters.size)    q = q.eq("Size", currentFilters.size.toLowerCase());

            const { data, error } = await q;
            if (error) {
                console.error("fetchOptions error:", error);
                return [];
            }

            const values = data
                .map((row: any) => row[column])
                .filter((v: any) => v != null)
                .map((v: string) => v.trim());

            // Capitalize species/gender/size; keep breed as-is
            if (["Species", "Gender", "Size"].includes(column)) {
                return [...new Set(values)].map(cap).sort();
            }
            return [...new Set(values)].sort();
        },
        [supabase]
    );

    /* Re-fetch all dropdowns when any filter changes */
    useEffect(() => {
        const filters = { species, breed, gender, size };

        fetchOptions("Species", { ...filters, species: "" }).then(setOptSpecies);
        fetchOptions("Breed",   { ...filters, breed: "" }).then(setOptBreeds);
        fetchOptions("Gender",  { ...filters, gender: "" }).then(setOptGenders);
        fetchOptions("Size",    { ...filters, size: "" }).then(setOptSizes);
    }, [species, breed, gender, size, fetchOptions]);

    /* Sync filter state to URL (for bookmarking/sharing) */
    const syncUrl = () => {
        const params = new URLSearchParams();
        if (species) params.set("species", species);
        if (breed)   params.set("breed", breed);
        if (gender)  params.set("gender", gender);
        if (size)    params.set("size", size);
        window.history.replaceState(null, "", `?${params.toString()}`);
    };
    useEffect(syncUrl, [species, breed, gender, size]);

    return (
        <>
            {/* Location inputs */}
            <div className="grid grid-cols-3 gap-2">
                <input name="city"  placeholder="City"  className="border rounded p-2" defaultValue={searchParams.city ?? ""} />
                <input name="state" placeholder="State" className="border rounded p-2" defaultValue={searchParams.state ?? ""} />
                <input name="zip"   placeholder="Zip"   className="border rounded p-2" defaultValue={searchParams.zip ?? ""} />
            </div>

            {/* Species / Breed / Size */}
            <div className="grid grid-cols-3 gap-2 mt-2">
                <select name="species" className="border rounded p-2" value={species} onChange={e => setSpecies(e.target.value)}>
                    <option value="">Species</option>
                    {optSpecies.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select name="breed" className="border rounded p-2" value={breed} onChange={e => setBreed(e.target.value)}>
                    <option value="">Breed</option>
                    {optBreeds.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <select name="size" className="border rounded p-2" value={size} onChange={e => setSize(e.target.value)}>
                    <option value="">Size</option>
                    {optSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Name / Gender / Age */}
            <div className="grid grid-cols-3 gap-2 mt-2">
                <input name="name" placeholder="Name" className="border rounded p-2" defaultValue={searchParams.name ?? ""} />

                <select name="gender" className="border rounded p-2" value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Gender</option>
                    {optGenders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>

                <input name="age" placeholder="Age" className="border rounded p-2" defaultValue={searchParams.age ?? ""} />
            </div>
        </>
    );
}