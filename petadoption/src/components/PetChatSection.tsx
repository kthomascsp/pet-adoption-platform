'use client';

import { useEffect, useState } from "react";
import { RealtimeChat } from '@/components/realtime-chat';
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";

type PetChatSectionProps = {
    petId: string;
    petName: string | null;
    petOwner: string | null;
};

export function PetChatSection({ petId, petName, petOwner }: PetChatSectionProps) {
    const { user } = useAuth();
    const supabase = createClient();
    const displayName = petName || "this pet";

    const [profileType, setProfileType] = useState<string | null>(null);

    useEffect(() => {
        if(!user) return;

        const fetchProfileType = async() => {
        const { data, error } = await supabase.from("Profile")
            .select("ProfileType").eq("ProfileID", user.id).single();

        if(error) {
            console.error(error);
            return;
        }
        setProfileType(data?.ProfileType ?? null);
        };
        fetchProfileType();
    }, [user]);

    if(!user) {
        return (
        <div className="m-8 text-center">
            Please log in to join the conversation about {displayName}.
        </div>
        );
    }

    if(profileType === null) {
        return <p className="m-8 text-center">Loading chat settings</p>;
    }

    if(profileType == "shelter" && petOwner != user.id) {
        return <p className="m-10 font-bold text-2xl">You can not chat on a pet you don't own</p>
    }

    return (
        <RealtimeChat
        currentUserId={user.id}
        threadKey={`pet-${petId}`}
        title={`Open questions about ${displayName}`}
        />
    );
}
