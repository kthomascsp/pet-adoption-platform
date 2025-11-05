'use client';

import { RealtimeChat } from '@/components/realtime-chat';
import { useSupabaseUser } from '@/hooks/use-supabase-user';

export default function Page() {
    const currentUserId = useSupabaseUser();

    // Optional: show loading or fallback
    if (!currentUserId) {
        return <p className="text-xl">Loading your profile…</p>;
    }

    //console.log("currentUserId: " + currentUserId);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
            <RealtimeChat currentUserId={currentUserId} />
        </main>
    );
}