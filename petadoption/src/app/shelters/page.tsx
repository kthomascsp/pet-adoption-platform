import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Database } from "@/types/supabase";


/**pets
 * PetsPage Component (Server Component)
 * - Displays a list of pets retrieved from Supabase
 * - Allows users to search and filter by various fields
 * - Uses server-side data fetching (no client-side JavaScript needed)
 */
export default async function ShletersPage(props: { searchParams?: Record<string, string | undefined> }) {
    // Extract URL search parameters (e.g., ?city=Austin)
    const searchParams = await props.searchParams ?? {};

    //let shelters: Tables<"Profile">[] = [];
    let shelters: Database["public"]["Views"]["shelter_search_view"]["Row"][] = [];
    let errorMessage = "";

    try {
        // Initialize Supabase client (server-side)
        const supabase = await createClient();

        // Get list of shelters from Supabase
        const { data, error } = await supabase
            .from<"shelter_search_view", Database["public"]["Views"]["shelter_search_view"]>("shelter_search_view")
            .select("*")
            .ilike("City", `%${searchParams.city || ""}%`)
            .ilike("State", `%${searchParams.state || ""}%`)
            .ilike("Zip", `%${searchParams.zip || ""}%`)
            .ilike("ProfileName", `%${searchParams.name || ""}%`);

        // Assign results
        shelters = data || [];

        // Handle query errors
        if (error) {
            console.error("Supabase query error:", error);
            errorMessage = error.message;
        } else {
            shelters = data || [];
        }
    } catch (err) {
        // Handle unexpected errors gracefully
        console.error("Unexpected error:", err);
        errorMessage = err instanceof Error ? err.message : String(err);
    }

    return (
        <div>
            {/* Page Header */}
            <h1 className="text-3xl font-bold text-center m-8">
                Find A Reliable Shelter
            </h1>

            {/* Search Form — sends query as GET parameters */}
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
                    <input type="text" name="address" placeholder="Address" className="border p-3 w-full" defaultValue={searchParams.address || ""} />
                    <input type="text" name="description" placeholder="Description" className="border p-3 w-full" defaultValue={searchParams.description || ""} />
                </div>

                {/* Form actions: Clear and Search */}
                <div className="flex w-full justify-center">
                    {/* Clear = just navigates back to /pets with no search params */}
                    <Link href="/shelters" className="cursor-pointer p-4 font-bold bg-red-200 text-red-500 w-[20%] text-center">
                        Clear
                    </Link>

                    {/* Submitting the form triggers a new server render with updated filters */}
                    <button
                        type="submit"
                        className="cursor-pointer p-4 font-bold bg-blue-400 w-[20%]"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Display results or errors */}
            {errorMessage ? (
                // Error message
                <p className="text-red-400 text-center m-6">
                    No shelters found: {errorMessage}
                </p>
            ) : shelters.length > 0 ? (
                // Results grid — shows shelter cards
                <div className="flex flex-wrap justify-center p-6 m-8 ">
                    {shelters.map((Profile) => (
                        <Link key={Profile.ProfileID} href={`/shelters/${Profile.ProfileID}`}
                        className="cursor-pointer border m-8 p-6 flex flex-col items-center hover:shadow-lg transition-shadow w-[20%]">
                            {/* Pet image (or placeholder if none) */}
                            <div className="relative w-full h-48 mb-4">
                                <Image
                                    src={Profile.ImageURL || "/shelter-generic.png"}
                                    alt={Profile.ProfileName || "Generic Shelter"}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>



                            {/* Pet details */}
                            <h2 className="text-2xl font-semibold p-2">
                                {Profile.ProfileName}
                            </h2>
                            <p>{Profile.Address}, {Profile.Zip}</p>
                            <p>{Profile.City}, {Profile.State}</p>
                            <p>{formatPhone(Profile.Phone)}, {Profile.ProfileEmail || "No email listed"}</p>
                            <p className="p-3 text-center">{Profile.ProfileDescription}</p>
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

function formatPhone(phone: string | null): string {
    if (!phone) return "No phone listed";
    return `(${phone.slice(0, 3)})-${phone.slice(3, 6)}-${phone.slice(6)}`;
}

