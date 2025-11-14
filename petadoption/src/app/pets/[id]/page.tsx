import MapProviderWrapper from "@/components/MapProviderWrapper";
import MapView from "@/components/MapView";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PetPage({ params, searchParams }: { params: { id: string }; searchParams: { applied?: string } }) {
    const supabase = await createClient();

    const { data: pet, error } = await supabase
        .from("pet_search_view")
        .select("*")
        .eq("PetID", params.id)
        .single();

    const imageUrl: string =
        pet !== null
            ? pet.ImageURL !== null
                ? pet.ImageURL !== "NULL"
                    ? pet.ImageURL
                    : "/dog-generic.png"
                : "/dog-generic.png"
            : "/dog-generic.png";

    if (!pet?.ProfileID) {
        return (
            <div className="text-red-500 text-center text-5xl">
                Shelter information not available.
            </div>
        );
    }

    const { data: shelter, error: shelterError } = await supabase
        .from("Profile")
        .select("ProfileID, ProfileName, Address, City, State, Zip")
        .eq("ProfileID", pet.ProfileID)
        .single();

    if (shelterError || !shelter) {
        return <div className="text-red-500 text-center text-5xl">Shelter not found?</div>;
    }

    if (error || !pet) {
        return notFound();
    }

    function calculateAge(birthdate: string): string {
        if (!birthdate) return "Unknown Age";
        const birth = new Date(birthdate);
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();

        if (monthDifference < 0) {
            return `${age - 1}`;
        }
        return `${age}`;
    }

    async function getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        const result = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );

        if (!result.ok) {
            console.error("Incorrect address for shelter");
            return null;
        }

        const data = await result.json();
        const numberLocation = data.results?.[0]?.geometry?.location;

        return { lat: numberLocation.lat, lng: numberLocation.lng };
    }

    const fullAddress = `${shelter.Address}, ${shelter.City}, ${shelter.State}`;
    const coordinates = await getCoordinates(fullAddress);

    const applied = searchParams.applied === "true";

    return (
        <div className="flex flex-col items-center border-collapse justify-center p-6">
            {/* SUCCESS TOAST */}
            {applied && (
                <div className="mb-6 w-full max-w-2xl bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r shadow-md">
                    <p className="font-semibold">Application submitted successfully!</p>
                    <p className="text-sm">The shelter will contact you soon.</p>
                </div>
            )}

            <h1 className="text-4xl font-bold m-6">{pet.PetName}</h1>
            <Image
                className="m-6 rounded-lg"
                src={imageUrl}
                alt={pet.PetName || "Pet photo"}
                width={300}
                height={300}
            />
            {coordinates ? (
                <MapProviderWrapper>
                    <MapView
                        markers={[
                            {
                                id: shelter.ProfileID,
                                lat: coordinates.lat,
                                lng: coordinates.lng,
                                label: shelter.ProfileName,
                            },
                        ]}
                    />
                </MapProviderWrapper>
            ) : (
                <p>Not Available</p>
            )}

            <h2 className="text-4xl font-bold m-6">Details</h2>
            <table className="min-w-[400px] w-[600px] border shadow-md">
                <tbody>
                <tr>
                    <td className="p-4 font-semibold border w-40">Species</td>
                    <td className="p-4 border text-center">{pet.Species}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Breed</td>
                    <td className="p-4 border text-center">{pet.Breed}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Gender</td>
                    <td className="p-4 border text-center">{pet.Gender}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border">Age</td>
                    <td className="p-4 border text-center">{calculateAge(pet.Birthdate || "Unknown")}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Size</td>
                    <td className="p-4 border text-center">{pet.Size}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border">Location</td>
                    <td className="p-4 border text-center">
                        {pet.City}, {pet.State} {pet.Zip}
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="mt-8 text-center">
                <Link
                    href={`/pets/${params.id}/apply`}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded"
                >
                    Apply to Adopt {pet.PetName}
                </Link>
            </div>
        </div>
    );
}