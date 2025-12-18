/**
 * Displays an individual chat message.
 * - Shows sender name or ID prefix.
 * - Displays formatted timestamp and message content.
 */

'use client';

import React, {useEffect, useState} from 'react';
import { ChatMessage } from '@/hooks/use-realtime-chat';
import { useAuth } from "@/context/AuthContext";
//import ProfileAvatar from "@/components/ProfileAvatar";
import UserAvatar from "@/components/UserAvatar";
import {createClient} from "@/utils/supabase/client";

interface ChatMessageItemProps {
    message: ChatMessage;
    userName?: string;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, userName }) => {
    const { profile } = useAuth();
    const supabase = createClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!message.senderId) return;

        const loadAvatar = async () => {
            const { data } = await supabase
                .from("profile_search_view")
                .select("ImageURL")
                .eq("ProfileID", message.senderId)
                .single();

            setAvatarUrl(data?.ImageURL || null);
            console.log("message.senderId: ", message.senderId, " | avatarUrl: ", avatarUrl);
        };

        loadAvatar();
    }, [message.senderId, supabase]);

    // Format timestamp
    const formattedTime = message.messageDateTime
        ? new Date(message.messageDateTime).toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
        })
        : 'No time';

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow transition">
            <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
                <div className="flex justify-start items-center gap-2">
                    {/*<ProfileAvatar profile={profile || {}} size={36} />*/}
                    <UserAvatar imageUrl={avatarUrl} size={36} />
                    <span className="font-semibold text-indigo-600">
                        {userName || (message.senderId ? message.senderId.slice(0, 8) : 'Unknown')}
                    </span>
                </div>
                <span className="text-gray-400">{formattedTime}</span>
            </div>

            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                {message.content || (
                    <span className="italic text-gray-400">No content</span>
                )}
            </p>
        </div>
    );
};
