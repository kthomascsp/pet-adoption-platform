"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import PetAvatar from "@/components/PetAvatar";
import { useAuth } from "@/context/AuthContext";

export default function PetPageClient({ pet, petId, petOwner }: any) {
  const supabase = createClient();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  //Forcing reload to load the chat and image editor for pets correctly
  useEffect(() => {
    const reloadKey = `petPageReloaded-${petId}`;
    if(typeof window !== "undefined") {
      if(!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, "true");
        window.location.reload();
      }
      else {
        sessionStorage.removeItem(reloadKey);
      }
    }
  }, [petId]);

  useEffect(() => {
    const loadPetImage = async () => {
      const { data } = await supabase
        .from("Image")
        .select("URL")
        .eq("OwnerID", petId)
        .eq("ImageType", "pet")
        .maybeSingle();

      setImageUrl(data?.URL ?? null);
    };

    loadPetImage();
  }, [petId]);

  if (!user) return null;
  if (petOwner != user.id) return null;

  return (
    <div className="border-black border-5 p-10 m-8 flex flex-col items-center">
      <h3 className="mb-8 text-3xl font-bold">Pet Image Changer</h3>
      <img
        src={imageUrl || pet.ImageURL || "/dog-generic.png"}
        alt={pet.PetName}
        width={300}
        height={300}
        className="rounded-lg mb-10"
      />

      <PetAvatar
        key={petId} // ensures internal state resets
        petID={petId}
        imageUrl={imageUrl}
        editable
        size={120}
        onImageUpdated={(url) => setImageUrl(url)}
      />
    </div>
  );
}
