'use client';

import { RealtimeChat } from '@/components/realtime-chat';

export default function Page() {
    const currentUserId = 'c2f9e70f-8b47-42a1-9e59-17cb5e5c80e9'; // Example user

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
            <RealtimeChat currentUserId={currentUserId} />
        </main>
    );
}
