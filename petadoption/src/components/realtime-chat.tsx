/**
 * Renders the real-time chat interface.
 * - Displays a scrollable list of messages.
 * - Submits new messages to the database.
 * - Uses the `useRealtimeChat` hook to listen for updates.
 */

'use client';

import React, { FormEvent } from 'react';
import { useRealtimeChat } from '@/hooks/use-realtime-chat';
import { ChatMessageItem } from '@/components/chat-message';

interface RealtimeChatProps {
    currentUserId: string;
}

export const RealtimeChat: React.FC<RealtimeChatProps> = ({ currentUserId }) => {
    const { messages, sendMessage, userNames } = useRealtimeChat();

    /**
     * Handles form submission:
     * - Prevents default reload
     * - Sends a new message via Supabase
     * - Clears the input field
     */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem('message') as HTMLInputElement;

        if (input.value.trim().length > 0) {
            sendMessage(currentUserId, input.value.trim());
            input.value = '';
        }
    };

    return (
        <div className="flex flex-col h-[80vh] w-full max-w-3xl bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">
                Open Forum Test
            </h2>

            {/* Message feed */}
            <div className="flex-1 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center italic mt-4">
                        No posts yet. Be the first to start the discussion!
                    </p>
                ) : (
                    messages.map((msg) => (
                        <ChatMessageItem
                            key={msg.id}
                            message={msg}
                            userName={userNames[msg.senderId]}
                        />
                    ))
                )}
            </div>

            {/* New message input */}
            <form onSubmit={handleSubmit} className="mt-4 flex items-center border-t pt-4 gap-2">
                <input
                    name="message"
                    type="text"
                    placeholder="Write a post..."
                    className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    Post
                </button>
            </form>
        </div>
    );
};
