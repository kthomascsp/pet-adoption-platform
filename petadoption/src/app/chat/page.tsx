/**
 * Displays the chat page for logged-in users.
 * - Fetches the current user's ID from Supabase.
 * - Shows a loading message while user info is being fetched.
 * - Renders the real-time chat component when ready.
 */

'use client';

import { RealtimeChat } from '@/components/realtime-chat';
import { useSupabaseUser } from '@/hooks/use-supabase-user';

export default function Page() {
    const currentUserId = useSupabaseUser(); // Get currently logged-in user's ID

    // Show a loading state until the user is identified
    if (!currentUserId) {
        return <p className="text-xl">Loading your profile…</p>;
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
            {/* Main chat interface */}
            <RealtimeChat currentUserId={currentUserId} />
        </main>
    );
}
