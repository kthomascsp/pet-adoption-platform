'use client';

import { RealtimeChat } from '@/components/realtime-chat';
//import { useSupabaseUser } from '@/hooks/use-supabase-user';
import { useAuth } from "@/context/AuthContext";

type PetChatSectionProps = {
    petId: string;
    petName: string | null;
};

export function PetChatSection({ petId, petName }: PetChatSectionProps) {
    //const currentUserId = useSupabaseUser();
    const { user } = useAuth();
    const displayName = petName || 'this pet';

    if (!user) {
        return (
            <div className="mt-8 w-full max-w-3xl text-center text-gray-600">
                <p className="italic">
                    Please log in to join the conversation about {displayName}.
                </p>
            </div>
        );
    }

    return (
        <RealtimeChat
            currentUserId={user.id}
            threadKey={`pet-${petId}`}
            title={`Open questions about ${displayName}`}
        />
    );
}
