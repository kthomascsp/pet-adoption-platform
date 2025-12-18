'use client';

import { RealtimeChat } from '@/components/realtime-chat';
import { useSupabaseUser } from '@/hooks/use-supabase-user';

type ShelterChatSectionProps = {
    shelterId: string;
    shelterName: string | null;
};

export function ShelterChatSection({ shelterId, shelterName }: ShelterChatSectionProps) {
    const currentUserId = useSupabaseUser();
    const displayName = shelterName || 'this shelter';

    //If not logged in
    if (!currentUserId) {
        return (
            <div className="mt-8 w-full max-w-3xl text-center text-gray-600">
                <p className="italic">Please log in to join the discussion about {displayName}.</p>
            </div>
        );
    }

    return (
        <RealtimeChat
            currentUserId={currentUserId}
            threadKey={`shelter-${shelterId}`}
            title={`Questions about ${displayName}`}
        />
    );
}
