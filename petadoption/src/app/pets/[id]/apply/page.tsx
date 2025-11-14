import { createClient } from "@/utils/supabase/server";
import ApplyForm from "./ApplyForm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ApplyPage({
                                            params,
                                        }: {
    params: { id: string };
}) {
    const supabase = await createClient();

    // -------------------------------------------------
    // 1. Load the pet (same query you already use)
    // -------------------------------------------------
    const { data: pet, error } = await supabase
        .from("pet_search_view")
        .select("*")
        .eq("PetID", params.id)
        .single();

    if (error || !pet) notFound();

    const imageUrl =
        pet.ImageURL && pet.ImageURL !== "NULL"
            ? pet.ImageURL
            : "/dog-generic.png";

    // -------------------------------------------------
    // 2. Load shelter name (optional, nice to show)
    // -------------------------------------------------
    let shelterName = "Unknown Shelter";
    if (pet.ProfileID) {
        const { data: shelter } = await supabase
            .from("Profile")
            .select("ProfileName")
            .eq("ProfileID", pet.ProfileID)
            .single();
        shelterName = shelter?.ProfileName ?? shelterName;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* ---- Pet Header ---- */}
            <section className="bg-white rounded-lg shadow p-6 flex gap-6 items-start">
                <Image
                    src={imageUrl}
                    alt={pet.PetName || ""}
                    width={180}
                    height={180}
                    className="rounded-lg object-cover"
                />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{pet.PetName}</h1>
                    <p className="text-lg text-gray-600">
                        {pet.Breed} • {pet.Gender} • {pet.City}, {pet.State}
                    </p>
                    <p className="mt-2">
                        <strong>Shelter:</strong> {shelterName}
                    </p>
                    <Link
                        href={`/pets/${params.id}`}
                        className="inline-block mt-4 text-blue-600 hover:underline"
                    >
                        ← Back to pet profile
                    </Link>
                </div>
            </section>

            {/* ---- Application Form (client component) ---- */}
            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Adoption Application for {pet.PetName}
                </h2>

                {/* The form lives in a separate file so it can be "use client" */}
                <ApplyForm petId={params.id} />
            </section>
        </div>
    );
}