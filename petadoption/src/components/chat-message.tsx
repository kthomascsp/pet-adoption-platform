'use client';

import React from 'react';
import { ChatMessage } from '@/hooks/use-realtime-chat';

interface ChatMessageItemProps {
    message: ChatMessage;
    userName?: string;            // <-- NEW
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
                                                                    message,
                                                                    userName,
                                                                }) => {
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
                {/* NAME or short UUID */}
                <span className="font-semibold text-indigo-600">
          {userName || (message.senderId ? message.senderId.slice(0, 8) : 'Unknown')}
        </span>

                <span className="text-gray-400">{formattedTime}</span>
            </div>

            <p className="text-gray-800 leading-relaxed">
                {message.content || <span className="italic text-gray-400">No content</span>}
            </p>
        </div>
    );
};