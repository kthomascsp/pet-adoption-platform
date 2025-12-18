import MapProviderWrapper from "@/components/MapProviderWrapper";
import MapView from "@/components/MapView";
import { createClient } from "@/utils/supabase/server";
import { ShelterChatSection } from "@/components/ShelterChatSection";
import EditablePetsTable from "@/components/EditableTable";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function ShelterPage({ params }: PageProps) {
    const supabase = await createClient();

    const { id } = await params;
    const shelterId = id;

    const { data: shelter, error } = await supabase
        .from("Profile")
        .select("*")
        .eq("ProfileID", shelterId)
        .single();

    if (error || !shelter) {
        return (
            <div className="text-red-500 text-center text-5xl">
                Shelter not found?
            </div>
        );
    }

    async function getCoordinates(
        address: string
    ): Promise<{ lat: number; lng: number } | null> {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        const result = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${apiKey}`
        );

        if (!result.ok) {
            console.error("Incorrect address for shelter");
            return null;
        }

        const data = await result.json();
        const loc = data.results?.[0]?.geometry?.location;

        return { lat: loc.lat, lng: loc.lng };
    }

    const fullAddress = `${shelter.Address}, ${shelter.City}, ${shelter.State}`;
    const coordinates = await getCoordinates(fullAddress);

    return (
        <div className="flex flex-col items-center border-collapse justify-center p-6">
            <h1 className="text-4xl font-bold m-6">{shelter.ProfileName}</h1>

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
                    <td className="p-4 font-semibold border w-40">Address</td>
                    <td className="p-4 border text-center">
                        {shelter.Address}, {shelter.City} {shelter.State},{" "}
                        {shelter.Zip}
                    </td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Contact Email</td>
                    <td className="p-4 border text-center">
                        {shelter.ProfileEmail}
                    </td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Contact Phone</td>
                    <td className="p-4 border text-center">{shelter.Phone}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border">Description</td>
                    <td className="p-4 border text-center">
                        {shelter.ProfileDescription}
                    </td>
                </tr>
                </tbody>
            </table>


            <ShelterChatSection
                shelterId={shelterId}
                shelterName={shelter.ProfileName}
            />

            <h2 className="text-3xl font-bold m-6">Pets</h2>
            <EditablePetsTable shelterId={shelterId} />
        </div>
    );
}
